// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/GUIToken.sol";

contract GUITokenTest is Test {
    GUIToken public token;
    address public owner;
    address public minter;
    address public user1;
    address public user2;

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    function setUp() public {
        owner = address(this);
        minter = address(0x1);
        user1 = address(0x2);
        user2 = address(0x3);
        
        token = new GUIToken(owner);
    }

    function testInitialSupply() public view {
        // Should mint 10% of max supply initially
        uint256 expectedSupply = token.MAX_SUPPLY() / 10;
        assertEq(token.totalSupply(), expectedSupply);
        assertEq(token.balanceOf(owner), expectedSupply);
    }

    function testMaxSupply() public view {
        assertEq(token.MAX_SUPPLY(), 1_000_000_000 * 10**18);
    }

    function testAddMinter() public {
        vm.expectEmit(true, false, false, false);
        emit MinterAdded(minter);
        
        token.addMinter(minter);
        assertTrue(token.minters(minter));
    }

    function testCannotAddZeroAddressAsMinter() public {
        vm.expectRevert("GUIToken: zero address");
        token.addMinter(address(0));
    }

    function testCannotAddMinterTwice() public {
        token.addMinter(minter);
        
        vm.expectRevert("GUIToken: already minter");
        token.addMinter(minter);
    }

    function testRemoveMinter() public {
        token.addMinter(minter);
        
        vm.expectEmit(true, false, false, false);
        emit MinterRemoved(minter);
        
        token.removeMinter(minter);
        assertFalse(token.minters(minter));
    }

    function testMint() public {
        token.addMinter(minter);
        uint256 amount = 1000 * 10**18;
        
        vm.prank(minter);
        vm.expectEmit(true, false, false, true);
        emit TokensMinted(user1, amount);
        
        token.mint(user1, amount);
        assertEq(token.balanceOf(user1), amount);
    }

    function testCannotMintWithoutAuthorization() public {
        uint256 amount = 1000 * 10**18;
        
        vm.prank(user1);
        vm.expectRevert("GUIToken: not authorized to mint");
        token.mint(user1, amount);
    }

    function testCannotMintExceedingMaxSupply() public {
        token.addMinter(minter);
        
        uint256 initialSupply = token.totalSupply();
        uint256 remainingSupply = token.MAX_SUPPLY() - initialSupply;
        uint256 excessAmount = remainingSupply + 1;
        
        vm.prank(minter);
        vm.expectRevert("GUIToken: exceeds max supply");
        token.mint(user1, excessAmount);
    }

    function testBurn() public {
        uint256 amount = 1000 * 10**18;
        token.transfer(user1, amount);
        
        vm.expectEmit(true, false, false, true);
        emit TokensBurned(user1, amount);
        
        vm.prank(user1);
        token.burn(amount);
        assertEq(token.balanceOf(user1), 0);
    }

    function testBurnFrom() public {
        uint256 amount = 1000 * 10**18;
        token.transfer(user1, amount);
        
        vm.prank(user1);
        token.approve(user2, amount);
        
        vm.expectEmit(true, false, false, true);
        emit TokensBurned(user1, amount);
        
        vm.prank(user2);
        token.burnFrom(user1, amount);
        assertEq(token.balanceOf(user1), 0);
    }

    function testPause() public {
        token.pause();
        assertTrue(token.paused());
    }

    function testCannotTransferWhenPaused() public {
        uint256 amount = 1000 * 10**18;
        token.pause();
        
        vm.expectRevert();
        token.transfer(user1, amount);
    }

    function testUnpause() public {
        token.pause();
        token.unpause();
        assertFalse(token.paused());
    }

    function testTransferAfterUnpause() public {
        uint256 amount = 1000 * 10**18;
        token.pause();
        token.unpause();
        
        token.transfer(user1, amount);
        assertEq(token.balanceOf(user1), amount);
    }

    function testOnlyOwnerCanAddMinter() public {
        vm.prank(user1);
        vm.expectRevert();
        token.addMinter(minter);
    }

    function testOnlyOwnerCanPause() public {
        vm.prank(user1);
        vm.expectRevert();
        token.pause();
    }
}

