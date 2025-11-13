# SafeMeet Deployment Guide

## Quick Start Deployment

### 1. Setup Environment

```bash
cd /home/mrwicks/Desktop/MyDesktop/SafeMeet/contracts

# Create .env file
cat > .env << EOF
PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key_here
EOF
```

### 2. Get Base Sepolia ETH

- Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Or use: https://www.alchemy.com/faucets/base-sepolia
- You need ~0.05 ETH for deployment

### 3. Verify Everything Compiles

```bash
forge build
```

### 4. Run Tests

```bash
forge test
```

Expected output: **54 tests passed, 0 failed**

### 5. Deploy to Base Sepolia

```bash
# Load environment variables
source .env

# Deploy (note: script is in 'script' folder, singular)
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY \
  -vvvv
```

### 6. Save Contract Addresses

After deployment, you'll see output like:

```
=== SAFEMEET PROTOCOL DEPLOYMENT SUMMARY ===

Core Contracts:
  Treasury:         0x...
  GUIToken:         0x...
  SafeMeetFactory:  0x...
  YieldRouter:      0x...
  GUIStaking:       0x...
  NFTPostcard:      0x...
```

**Save these addresses!** You'll need them for:

- Frontend configuration
- Contract interactions
- Admin operations

### 7. Verify Deployment

Check on BaseScan:

```
https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
```

## Deployment Checklist

- [ ] Environment variables set in `.env`
- [ ] Have Base Sepolia ETH (~0.05 ETH)
- [ ] All tests passing (`forge test`)
- [ ] Contracts compiled (`forge build`)
- [ ] Deployment successful
- [ ] Contracts verified on BaseScan
- [ ] Addresses saved for frontend
- [ ] Test a puddle creation
- [ ] Test a deposit
- [ ] Test staking

## Post-Deployment Configuration

### 1. Add Supported Stablecoins to YieldRouter

```bash
cast send $YIELD_ROUTER_ADDRESS \
  "addSupportedStablecoin(address)" \
  $USDC_ADDRESS \
  --rpc-url $BASE_SEPOLIA_RPC \
  --private-key $PRIVATE_KEY
```

### 2. Configure Default Parameters (Optional)

```bash
# Update factory defaults
cast send $FACTORY_ADDRESS \
  "setDefaultParameters(uint256,uint256,uint256)" \
  $((14*24*60*60)) \  # 14 days lock
  $((20*10**6)) \      # 20 USDC min
  200 \                # 200 max members
  --rpc-url $BASE_SEPOLIA_RPC \
  --private-key $PRIVATE_KEY
```

### 3. Set Base URI for NFTs (Optional)

```bash
cast send $NFT_POSTCARD_ADDRESS \
  "setBaseURI(string)" \
  "https://api.safemeet.app/nft/metadata/" \
  --rpc-url $BASE_SEPOLIA_RPC \
  --private-key $PRIVATE_KEY
```

## Testing Deployed Contracts

### Create a Test Puddle

```bash
# Using cast
cast send $FACTORY_ADDRESS \
  "createPuddleWithDefaults(string,address)" \
  "Test Puddle" \
  $USDC_ADDRESS \
  --value 0.001ether \
  --rpc-url $BASE_SEPOLIA_RPC \
  --private-key $PRIVATE_KEY
```

### Get Puddle Address

```bash
cast call $FACTORY_ADDRESS \
  "getAllPuddles()" \
  --rpc-url $BASE_SEPOLIA_RPC
```

## Troubleshooting

### Issue: "Insufficient ETH"

**Solution**: Get more Base Sepolia ETH from faucet

### Issue: "Contract verification failed"

**Solution**: Verify manually:

```bash
forge verify-contract \
  --chain-id 84532 \
  --compiler-version v0.8.24 \
  $CONTRACT_ADDRESS \
  src/ContractName.sol:ContractName \
  --etherscan-api-key $BASESCAN_API_KEY
```

### Issue: "RPC URL not found"

**Solution**: Make sure `.env` is loaded:

```bash
source .env
echo $BASE_SEPOLIA_RPC  # Should print the URL
```

### Issue: "Transaction underpriced"

**Solution**: Increase gas price:

```bash
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC \
  --broadcast \
  --verify \
  --gas-price 2000000000  # 2 gwei
```

## Mainnet Deployment

**⚠️ Before deploying to mainnet:**

1. **Audit**: Have contracts audited by a professional firm
2. **Insurance**: Consider smart contract insurance
3. **Testing**: Extensive testing on testnet
4. **Multi-sig**: Set up multi-sig for admin functions
5. **Timelock**: Consider adding timelock for critical operations
6. **Bug Bounty**: Consider running a bug bounty program

### Mainnet Differences

- Use Base Mainnet RPC: `https://mainnet.base.org`
- Chain ID: 8453
- Real stablecoin addresses (USDC, USDT, etc.)
- Real DeFi protocol addresses (Aave, Compound, etc.)
- Higher gas costs - budget accordingly
- Verify all transactions carefully

## Security Best Practices

1. **Never share** your private key
2. **Always verify** contract addresses before interacting
3. **Use hardware wallet** for mainnet deployments
4. **Test thoroughly** on testnet first
5. **Monitor** deployed contracts regularly
6. **Set up alerts** for unusual activity

## Support

For issues or questions:

- Check the README.md
- Review test files for usage examples
- Check Foundry documentation
- Open an issue in the repository

---

**Happy Deploying! 🚀**
