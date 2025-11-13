# SafeMeet Contract Integration Guide

## 📦 Contract Addresses Configured

All deployed contract addresses are now available in your frontend at:
```
frontend/src/config/contracts.ts
```

### Deployed Contracts (Base Sepolia)

| Contract | Address |
|----------|---------|
| Treasury | `0xd058Ee5C116166225cB52F2AC251Cc9c27b03948` |
| GUIToken | `0xDE48f185ed77bAf3a67B63a9b7DD962A762Ff62E` |
| SafeMeetFactory | `0xF6490C95572e59ef76E88B2DcD2636F9E6Fca629` |
| YieldRouter | `0x70166c3f73085d1d6116C57E4572402771C225be` |
| GUIStaking | `0x64c48F7cd809F89328001050aD5f97940B7b7e21` |
| NFTPostcard | `0x124f33f36e195210774C16184680f3bD015AD383` |

## 🚀 Quick Start

### 1. Import Contract Addresses

```typescript
// Import all contracts
import { CONTRACTS } from '@/config/contracts';

// Or import specific ones
import { CONTRACT_ADDRESSES, CONTRACT_CONFIG } from '@/config';

// Use in your components
const factoryAddress = CONTRACTS.SafeMeetFactory;
const guiTokenAddress = CONTRACTS.GUIToken;
```

### 2. Use Custom Hooks

```typescript
import { useContractAddresses, useStakingTiers } from '@/hooks/useContracts';

function MyComponent() {
  const contracts = useContractAddresses();
  const stakingTiers = useStakingTiers();
  
  return (
    <div>
      <p>Factory: {contracts.factory}</p>
      <p>Gold Tier APY: {stakingTiers.GOLD.multiplier * 10}%</p>
    </div>
  );
}
```

### 3. Get Explorer Links

```typescript
import { getExplorerLink } from '@/config/contracts';

const txLink = getExplorerLink('0x123...', 'tx');
const addressLink = getExplorerLink('0x456...', 'address');

// Opens: https://sepolia.basescan.org/tx/0x123...
// Opens: https://sepolia.basescan.org/address/0x456...
```

## 🔧 Integration Examples

### Example 1: Create a Puddle

```typescript
import { ethers } from 'ethers';
import { CONTRACTS, CONTRACT_CONFIG } from '@/config';
import FactoryABI from '@/abis/SafeMeetFactory.json'; // You'll need to add ABIs

async function createPuddle() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const factory = new ethers.Contract(
    CONTRACTS.SafeMeetFactory,
    FactoryABI,
    signer
  );
  
  const tx = await factory.createPuddleWithDefaults(
    "My Savings Group",
    "0xYourUSDCAddress",
    { value: ethers.parseEther(CONTRACT_CONFIG.factory.creationFee) }
  );
  
  await tx.wait();
  console.log("Puddle created!");
}
```

### Example 2: Stake GUI Tokens

```typescript
import { CONTRACTS, CONTRACT_CONFIG } from '@/config';
import StakingABI from '@/abis/GUIStaking.json';

async function stakeTokens(amount: string, tier: number) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const staking = new ethers.Contract(
    CONTRACTS.GUIStaking,
    StakingABI,
    signer
  );
  
  // First approve
  const token = new ethers.Contract(
    CONTRACTS.GUIToken,
    TokenABI,
    signer
  );
  
  await token.approve(CONTRACTS.GUIStaking, ethers.parseEther(amount));
  
  // Then stake
  const tx = await staking.stake(ethers.parseEther(amount), tier);
  await tx.wait();
  console.log("Staked successfully!");
}
```

### Example 3: Display Contract Info

```typescript
import { CONTRACT_CONFIG, formatAddress } from '@/config';

function ContractInfo() {
  return (
    <div>
      <h2>GUI Token</h2>
      <p>Symbol: {CONTRACT_CONFIG.guiToken.symbol}</p>
      <p>Max Supply: {CONTRACT_CONFIG.guiToken.maxSupply}</p>
      <p>Address: {formatAddress(CONTRACTS.GUIToken)}</p>
      
      <h2>Staking Tiers</h2>
      {Object.entries(CONTRACT_CONFIG.staking.tiers).map(([name, tier]) => (
        <div key={name}>
          <h3>{name}</h3>
          <p>Multiplier: {tier.multiplier}x</p>
          <p>Lock Days: {tier.lockDays}</p>
          <p>Effective APY: {CONTRACT_CONFIG.staking.baseAPY * tier.multiplier}%</p>
        </div>
      ))}
    </div>
  );
}
```

## 📝 Next Steps

### 1. Add Contract ABIs

Create an `abis` folder and add your contract ABIs:

```bash
mkdir -p frontend/src/abis
```

Then copy the ABIs from your compiled contracts:

```bash
cp contracts/out/SafeMeetFactory.sol/SafeMeetFactory.json frontend/src/abis/
cp contracts/out/GUIToken.sol/GUIToken.json frontend/src/abis/
cp contracts/out/GUIStaking.sol/GUIStaking.json frontend/src/abis/
cp contracts/out/PuddleVault.sol/PuddleVault.json frontend/src/abis/
cp contracts/out/NFTPostcard.sol/NFTPostcard.json frontend/src/abis/
```

### 2. Set Up Web3 Library

Install wagmi or ethers:

```bash
# Using wagmi (recommended for React)
npm install wagmi viem @tanstack/react-query

# Or using ethers
npm install ethers
```

### 3. Configure Wallet Connection

Set up RainbowKit or ConnectKit for easy wallet connection:

```bash
npm install @rainbow-me/rainbowkit
```

### 4. Add Network Configuration

Import the network config in your app:

```typescript
import { NETWORK_CONFIG, CHAIN_ID } from '@/config';

// Use with wagmi
const config = {
  chains: [
    {
      id: NETWORK_CONFIG.chainId,
      name: NETWORK_CONFIG.chainName,
      network: 'base-sepolia',
      nativeCurrency: NETWORK_CONFIG.nativeCurrency,
      rpcUrls: {
        default: { http: NETWORK_CONFIG.rpcUrls },
        public: { http: NETWORK_CONFIG.rpcUrls },
      },
      blockExplorers: {
        default: { 
          name: 'BaseScan', 
          url: NETWORK_CONFIG.blockExplorerUrls[0] 
        },
      },
    },
  ],
};
```

## 🔍 Verify Contracts

All contracts can be verified on BaseScan:
- https://sepolia.basescan.org/address/0xF6490C95572e59ef76E88B2DcD2636F9E6Fca629 (Factory)
- https://sepolia.basescan.org/address/0xDE48f185ed77bAf3a67B63a9b7DD962A762Ff62E (GUI Token)
- https://sepolia.basescan.org/address/0x64c48F7cd809F89328001050aD5f97940B7b7e21 (Staking)

## 📚 Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [Ethers Documentation](https://docs.ethers.org/)
- [Base Documentation](https://docs.base.org/)
- [RainbowKit](https://www.rainbowkit.com/)

## 💡 Tips

1. **Always check network**: Use `isCorrectNetwork(chainId)` before transactions
2. **Handle errors**: Wrap contract calls in try-catch blocks
3. **Show loading states**: Transactions take time, show user feedback
4. **Use events**: Listen to contract events for real-time updates
5. **Cache data**: Use React Query or SWR to cache contract reads

## 🎯 Common Contract Interactions

### Read Operations (No gas)
- Get puddle info
- Check token balance
- View staking info
- Get user's NFTs

### Write Operations (Requires gas)
- Create puddle
- Deposit to puddle
- Stake tokens
- Claim rewards
- Withdraw funds

---

Happy coding! 🚀

