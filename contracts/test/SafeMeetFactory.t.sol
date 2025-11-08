// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/SafeMeetFactory.sol";
import "../src/PuddleVault.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock USDC for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {}
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract SafeMeetFactoryTest is Test {
    SafeMeetFactory public factory;
    MockUSDC public usdc;
    address public owner;
    address public treasury;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        treasury = address(0x4); // Use a proper address, not a precompile
        user1 = address(0x2);
        user2 = address(0x3);
        
        factory = new SafeMeetFactory(owner);
        usdc = new MockUSDC();
        
        factory.setTreasury(treasury);
        
        // Give users some ETH for creation fees
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function testInitialState() public view {
        assertEq(factory.totalPuddlesCreated(), 0);
        assertEq(factory.activePuddlesCount(), 0);
        assertEq(factory.defaultLockPeriod(), 7 days);
        assertEq(factory.puddleCreationFee(), 0.001 ether);
    }

    function testCreatePuddle() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        address puddleAddress = factory.createPuddle{value: creationFee}(
            "Test Puddle",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        assertTrue(puddleAddress != address(0));
        assertTrue(factory.isPuddle(puddleAddress));
        assertEq(factory.totalPuddlesCreated(), 1);
        assertEq(factory.activePuddlesCount(), 1);
    }

    function testCreatePuddleWithDefaults() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        address puddleAddress = factory.createPuddleWithDefaults{value: creationFee}(
            "Default Puddle",
            address(usdc)
        );
        
        PuddleVault puddle = PuddleVault(puddleAddress);
        assertEq(puddle.lockPeriod(), factory.defaultLockPeriod());
        assertEq(puddle.minDepositAmount(), factory.defaultMinDeposit());
        assertEq(puddle.maxMembers(), factory.defaultMaxMembers());
    }

    function testCannotCreatePuddleWithoutFee() public {
        vm.prank(user1);
        vm.expectRevert("SafeMeetFactory: insufficient fee");
        factory.createPuddle{value: 0}(
            "Test Puddle",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
    }

    function testCannotCreatePuddleWithEmptyName() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        vm.expectRevert("SafeMeetFactory: empty name");
        factory.createPuddle{value: creationFee}(
            "",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
    }

    function testMultiplePuddles() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        factory.createPuddle{value: creationFee}(
            "Puddle 1",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        vm.prank(user2);
        factory.createPuddle{value: creationFee}(
            "Puddle 2",
            address(usdc),
            14 days,
            20 * 10**6,
            50
        );
        
        assertEq(factory.totalPuddlesCreated(), 2);
        assertEq(factory.activePuddlesCount(), 2);
    }

    function testGetAllPuddles() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        factory.createPuddle{value: creationFee}(
            "Puddle 1",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        vm.prank(user2);
        factory.createPuddle{value: creationFee}(
            "Puddle 2",
            address(usdc),
            14 days,
            20 * 10**6,
            50
        );
        
        address[] memory allPuddles = factory.getAllPuddles();
        assertEq(allPuddles.length, 2);
    }

    function testGetActivePuddles() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        address puddle1 = factory.createPuddle{value: creationFee}(
            "Puddle 1",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        vm.prank(user2);
        factory.createPuddle{value: creationFee}(
            "Puddle 2",
            address(usdc),
            14 days,
            20 * 10**6,
            50
        );
        
        // Deactivate puddle1
        vm.prank(user1);
        factory.deactivatePuddle(puddle1);
        
        address[] memory activePuddles = factory.getActivePuddles();
        assertEq(activePuddles.length, 1);
    }

    function testGetUserPuddles() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.startPrank(user1);
        factory.createPuddle{value: creationFee}(
            "Puddle 1",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        factory.createPuddle{value: creationFee}(
            "Puddle 2",
            address(usdc),
            14 days,
            20 * 10**6,
            50
        );
        vm.stopPrank();
        
        address[] memory userPuddles = factory.getUserPuddles(user1);
        assertEq(userPuddles.length, 2);
    }

    function testGetPuddleInfo() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        address puddleAddress = factory.createPuddle{value: creationFee}(
            "Test Puddle",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        SafeMeetFactory.PuddleInfo memory info = factory.getPuddleInfo(puddleAddress);
        assertEq(info.name, "Test Puddle");
        assertEq(info.creator, user1);
        assertEq(info.stablecoin, address(usdc));
        assertTrue(info.isActive);
    }

    function testDeactivatePuddleAsCreator() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        address puddleAddress = factory.createPuddle{value: creationFee}(
            "Test Puddle",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        vm.prank(user1);
        factory.deactivatePuddle(puddleAddress);
        
        SafeMeetFactory.PuddleInfo memory info = factory.getPuddleInfo(puddleAddress);
        assertFalse(info.isActive);
        assertEq(factory.activePuddlesCount(), 0);
    }

    function testDeactivatePuddleAsOwner() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        address puddleAddress = factory.createPuddle{value: creationFee}(
            "Test Puddle",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        // Owner (address(this)) can deactivate
        factory.deactivatePuddle(puddleAddress);
        
        SafeMeetFactory.PuddleInfo memory info = factory.getPuddleInfo(puddleAddress);
        assertFalse(info.isActive);
    }

    function testCannotDeactivatePuddleUnauthorized() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        address puddleAddress = factory.createPuddle{value: creationFee}(
            "Test Puddle",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        vm.prank(user2);
        vm.expectRevert("SafeMeetFactory: not authorized");
        factory.deactivatePuddle(puddleAddress);
    }

    function testGetPuddlesByStablecoin() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        factory.createPuddle{value: creationFee}(
            "USDC Puddle",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        address[] memory usdcPuddles = factory.getPuddlesByStablecoin(address(usdc));
        assertEq(usdcPuddles.length, 1);
    }

    function testSetDefaultParameters() public {
        uint256 newLockPeriod = 14 days;
        uint256 newMinDeposit = 20 * 10**6;
        uint256 newMaxMembers = 200;
        
        factory.setDefaultParameters(newLockPeriod, newMinDeposit, newMaxMembers);
        
        assertEq(factory.defaultLockPeriod(), newLockPeriod);
        assertEq(factory.defaultMinDeposit(), newMinDeposit);
        assertEq(factory.defaultMaxMembers(), newMaxMembers);
    }

    function testSetPuddleCreationFee() public {
        uint256 newFee = 0.002 ether;
        factory.setPuddleCreationFee(newFee);
        assertEq(factory.puddleCreationFee(), newFee);
    }

    function testPause() public {
        factory.pause();
        assertTrue(factory.paused());
        
        uint256 creationFee = factory.puddleCreationFee();
        vm.prank(user1);
        vm.expectRevert();
        factory.createPuddle{value: creationFee}(
            "Test Puddle",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
    }

    function testGetPuddleCount() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        factory.createPuddle{value: creationFee}(
            "Puddle 1",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        assertEq(factory.getPuddleCount(), 1);
    }

    function testIsValidPuddle() public {
        uint256 creationFee = factory.puddleCreationFee();
        
        vm.prank(user1);
        address puddleAddress = factory.createPuddle{value: creationFee}(
            "Test Puddle",
            address(usdc),
            7 days,
            10 * 10**6,
            100
        );
        
        assertTrue(factory.isValidPuddle(puddleAddress));
        assertFalse(factory.isValidPuddle(address(0x999)));
    }
}

