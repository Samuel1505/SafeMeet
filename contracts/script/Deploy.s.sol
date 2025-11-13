// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/GUIToken.sol";
import "../src/SafeMeetFactory.sol";
import "../src/YieldRouter.sol";
import "../src/GUIStaking.sol";
import "../src/NFTPostcard.sol";
import "../src/Treasury.sol";

/**
 * @title Deploy
 * @notice Main deployment script for SafeMeet protocol
 * @dev Deploys all core contracts and configures them
 *
 * Usage:
 * forge script script/Deploy.s.sol:Deploy --rpc-url base_sepolia --broadcast --verify
 */
contract Deploy is Script {
    // Deployed contracts
    GUIToken public guiToken;
    SafeMeetFactory public factory;
    YieldRouter public yieldRouter;
    GUIStaking public staking;
    NFTPostcard public nftPostcard;
    Treasury public treasury;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying SafeMeet Protocol...");
        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Treasury first (many contracts need it)
        console.log("\n1. Deploying Treasury...");
        treasury = new Treasury(deployer);
        console.log("Treasury deployed at:", address(treasury));

        // 2. Deploy GUI Token
        console.log("\n2. Deploying GUI Token...");
        guiToken = new GUIToken(deployer);
        console.log("GUIToken deployed at:", address(guiToken));

        // 3. Deploy NFT Postcard
        console.log("\n3. Deploying NFT Postcard...");
        nftPostcard = new NFTPostcard(deployer);
        console.log("NFTPostcard deployed at:", address(nftPostcard));

        // 4. Deploy Yield Router
        console.log("\n4. Deploying Yield Router...");
        yieldRouter = new YieldRouter(deployer);
        yieldRouter.setTreasury(address(treasury));
        console.log("YieldRouter deployed at:", address(yieldRouter));

        // 5. Deploy SafeMeet Factory
        console.log("\n5. Deploying SafeMeet Factory...");
        factory = new SafeMeetFactory(deployer);
        factory.setTreasury(address(treasury));
        factory.setYieldRouter(address(yieldRouter));
        factory.setNFTPostcard(address(nftPostcard));
        factory.setGUIToken(address(guiToken));
        console.log("SafeMeetFactory deployed at:", address(factory));

        // 6. Deploy GUI Staking
        console.log("\n6. Deploying GUI Staking...");
        staking = new GUIStaking(
            address(guiToken),
            address(treasury),
            deployer
        );
        console.log("GUIStaking deployed at:", address(staking));

        // 7. Configure contracts
        console.log("\n7. Configuring contracts...");

        // Add staking contract as authorized minter for rewards
        guiToken.addMinter(address(staking));
        console.log("- Added staking as GUI token minter");

        // Authorize factory to mint NFTs
        nftPostcard.authorizeMinter(address(factory));
        console.log("- Authorized factory to mint NFTs");

        // Set yield router factory
        yieldRouter.setFactory(address(factory));
        console.log("- Set factory in yield router");

        vm.stopBroadcast();

        // Print deployment summary
        printDeploymentSummary();

        console.log("\nDeployment complete!");
        console.log("Save these addresses for frontend integration.");
    }

    function printDeploymentSummary() internal view {
        console.log("\n=== SAFEMEET PROTOCOL DEPLOYMENT SUMMARY ===");
        console.log("\nCore Contracts:");
        console.log("  Treasury:         ", address(treasury));
        console.log("  GUIToken:         ", address(guiToken));
        console.log("  SafeMeetFactory:  ", address(factory));
        console.log("  YieldRouter:      ", address(yieldRouter));
        console.log("  GUIStaking:       ", address(staking));
        console.log("  NFTPostcard:      ", address(nftPostcard));

        console.log("\nToken Info:");
        console.log(
            "  GUI Token Supply: ",
            guiToken.totalSupply() / 10 ** 18,
            "GUI"
        );
        console.log(
            "  GUI Max Supply:   ",
            guiToken.MAX_SUPPLY() / 10 ** 18,
            "GUI"
        );

        console.log("\nFactory Config:");
        console.log("  Creation Fee:     ", factory.puddleCreationFee(), "wei");
        console.log(
            "  Default Lock:     ",
            factory.defaultLockPeriod() / 1 days,
            "days"
        );
        console.log(
            "  Min Deposit:      ",
            factory.defaultMinDeposit(),
            "units"
        );
        console.log("  Max Members:      ", factory.defaultMaxMembers());

        console.log("\nStaking Config:");
        console.log("  Base APY:         ", staking.baseAPY() / 100, "%");
        console.log(
            "  Min Stake:        ",
            staking.minStakeAmount() / 10 ** 18,
            "GUI"
        );

        console.log("\n===========================================");
    }
}
