// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/PuddleVault.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 token for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10 ** 6); // Mint 1M USDC
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract PuddleVaultTest is Test {
    PuddleVault public vault;
    MockUSDC public usdc;
    address public owner;
    address public factory;
    address public user1;
    address public user2;
    address public treasury;

    uint256 constant LOCK_PERIOD = 7 days;
    uint256 constant MIN_DEPOSIT = 10 * 10 ** 6; // 10 USDC
    uint256 constant MAX_MEMBERS = 100;

    function setUp() public {
        owner = address(this);
        factory = address(0x1);
        user1 = address(0x2);
        user2 = address(0x3);
        treasury = address(0x4);

        usdc = new MockUSDC();

        vault = new PuddleVault(
            "Test Puddle",
            address(usdc),
            owner,
            factory,
            LOCK_PERIOD,
            MIN_DEPOSIT,
            MAX_MEMBERS
        );

        vault.setTreasury(treasury);

        // Give users some USDC
        usdc.mint(user1, 10000 * 10 ** 6);
        usdc.mint(user2, 10000 * 10 ** 6);
    }

    function testInitialState() public view {
        assertEq(vault.puddleName(), "Test Puddle");
        assertEq(address(vault.stablecoin()), address(usdc));
        assertEq(vault.lockPeriod(), LOCK_PERIOD);
        assertEq(vault.minDepositAmount(), MIN_DEPOSIT);
        assertEq(vault.maxMembers(), MAX_MEMBERS);
        assertEq(vault.totalShares(), 0);
        assertEq(vault.totalAssets(), 0);
        assertEq(vault.memberCount(), 0);
    }

    function testDeposit() public {
        uint256 depositAmount = 100 * 10 ** 6; // 100 USDC

        vm.startPrank(user1);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);
        vm.stopPrank();

        assertEq(vault.memberCount(), 1);
        assertEq(vault.totalAssets(), depositAmount);
        assertTrue(vault.sharesOf(user1) > 0);
    }

    function testCannotDepositBelowMinimum() public {
        uint256 depositAmount = 5 * 10 ** 6; // 5 USDC (below minimum)

        vm.startPrank(user1);
        usdc.approve(address(vault), depositAmount);
        vm.expectRevert("PuddleVault: below minimum deposit");
        vault.deposit(depositAmount);
        vm.stopPrank();
    }

    function testMultipleDeposits() public {
        uint256 deposit1 = 100 * 10 ** 6;
        uint256 deposit2 = 200 * 10 ** 6;

        // User1 deposits
        vm.startPrank(user1);
        usdc.approve(address(vault), deposit1);
        vault.deposit(deposit1);
        vm.stopPrank();

        // User2 deposits
        vm.startPrank(user2);
        usdc.approve(address(vault), deposit2);
        vault.deposit(deposit2);
        vm.stopPrank();

        assertEq(vault.memberCount(), 2);
        assertEq(vault.totalAssets(), deposit1 + deposit2);
    }

    function testWithdrawAfterLockPeriod() public {
        uint256 depositAmount = 100 * 10 ** 6;

        vm.startPrank(user1);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        uint256 shares = vault.sharesOf(user1);

        // Fast forward past lock period
        vm.warp(block.timestamp + LOCK_PERIOD + 1);

        vault.withdraw(shares);
        vm.stopPrank();

        assertEq(vault.sharesOf(user1), 0);
        // Should receive slightly less due to withdrawal fee
        assertTrue(usdc.balanceOf(user1) > 9900 * 10 ** 6);
    }

    function testCannotWithdrawDuringLockPeriod() public {
        uint256 depositAmount = 100 * 10 ** 6;

        vm.startPrank(user1);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        uint256 shares = vault.sharesOf(user1);

        vm.expectRevert("PuddleVault: lock period not expired");
        vault.withdraw(shares);
        vm.stopPrank();
    }

    function testEmergencyWithdraw() public {
        uint256 depositAmount = 100 * 10 ** 6;

        vm.startPrank(user1);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        uint256 shares = vault.sharesOf(user1);

        // Emergency withdraw without waiting for lock period
        vault.emergencyWithdraw(shares);
        vm.stopPrank();

        assertEq(vault.sharesOf(user1), 0);
        // Should receive 95 USDC back (5% emergency fee)
        // User started with 10000, deposited 100, should get back 95
        // So balance should be around 9995
        assertTrue(usdc.balanceOf(user1) >= 9990 * 10 ** 6); // At least 9990
        assertTrue(usdc.balanceOf(user1) <= 9996 * 10 ** 6); // At most 9996
    }

    function testPreviewDeposit() public view {
        uint256 depositAmount = 100 * 10 ** 6;
        uint256 shares = vault.previewDeposit(depositAmount);

        // First deposit should be 1:1
        assertEq(shares, depositAmount);
    }

    function testPreviewWithdraw() public {
        uint256 depositAmount = 100 * 10 ** 6;

        vm.startPrank(user1);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        uint256 shares = vault.sharesOf(user1);
        uint256 assets = vault.previewWithdraw(shares);
        vm.stopPrank();

        // Should be slightly less than deposit due to withdrawal fee
        assertTrue(assets < depositAmount);
        assertTrue(assets > (depositAmount * 99) / 100); // At least 99%
    }

    function testBalanceOf() public {
        uint256 depositAmount = 100 * 10 ** 6;

        vm.startPrank(user1);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);
        vm.stopPrank();

        uint256 balance = vault.balanceOf(user1);
        assertEq(balance, depositAmount);
    }

    function testGetMembers() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), 100 * 10 ** 6);
        vault.deposit(100 * 10 ** 6);
        vm.stopPrank();

        vm.startPrank(user2);
        usdc.approve(address(vault), 100 * 10 ** 6);
        vault.deposit(100 * 10 ** 6);
        vm.stopPrank();

        address[] memory members = vault.getMembers();
        assertEq(members.length, 2);
        assertEq(members[0], user1);
        assertEq(members[1], user2);
    }

    function testSetLockPeriod() public {
        uint256 newLockPeriod = 14 days;
        vault.setLockPeriod(newLockPeriod);
        assertEq(vault.lockPeriod(), newLockPeriod);
    }

    function testSetFees() public {
        vault.setFees(100, 100, 500); // 1%, 1%, 5%
        assertEq(vault.depositFee(), 100);
        assertEq(vault.withdrawalFee(), 100);
        assertEq(vault.performanceFee(), 500);
    }

    function testCannotSetFeesTooHigh() public {
        vm.expectRevert("PuddleVault: deposit fee too high");
        vault.setFees(600, 100, 500); // 6% deposit fee (too high)
    }

    function testPause() public {
        vault.pause();
        assertTrue(vault.paused());

        vm.startPrank(user1);
        usdc.approve(address(vault), 100 * 10 ** 6);
        vm.expectRevert();
        vault.deposit(100 * 10 ** 6);
        vm.stopPrank();
    }

    function testUnpause() public {
        vault.pause();
        vault.unpause();
        assertFalse(vault.paused());

        vm.startPrank(user1);
        usdc.approve(address(vault), 100 * 10 ** 6);
        vault.deposit(100 * 10 ** 6);
        vm.stopPrank();
    }
}
