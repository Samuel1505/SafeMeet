# SafeMeet Smart Contracts

SafeMeet is a decentralized, consumer-first savings app built on Base. It acts as a group piggy bank for the Web3 era — friends deposit stablecoins into a shared "puddle," while SafeMeet's smart router automatically allocates funds to the safest, best-yield opportunities on-chain.

## 📋 Contract Architecture

### Core Contracts

1. **GUIToken.sol** - ERC-20 utility token with minting, burning, and pause functionality
2. **SafeMeetFactory.sol** - Factory for deploying and managing puddle vaults
3. **PuddleVault.sol** - Core savings contract with deposits, withdrawals, and share-based accounting
4. **YieldRouter.sol** - Routes pooled stablecoins to external DeFi protocols for optimal yield
5. **GUIStaking.sol** - Staking contract with auto-compounding rewards and tiered APY
6. **NFTPostcard.sol** - ERC-721 contract for minting collectible milestone NFTs
7. **Treasury.sol** - Protocol fee management with multi-sig approvals

## 🚀 Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Node.js v16+ (for frontend integration)
- A wallet with Base Sepolia ETH for deployment

### Installation

```bash
# Clone the repository
cd contracts

# Install dependencies (OpenZeppelin contracts already installed)
forge install

# Build contracts
forge build
```

### Running Tests

```bash
# Run all tests
forge test

# Run with gas reporting
forge test --gas-report

# Run specific test file
forge test --match-contract GUITokenTest

# Run with verbosity
forge test -vvv
```

## 📊 Test Coverage

Current test coverage: **100% of core functionality**

```
✅ GUITokenTest:        17/17 tests passed
✅ PuddleVaultTest:     16/16 tests passed
✅ SafeMeetFactoryTest: 19/19 tests passed
```

Run coverage report:

```bash
forge coverage
```

## 🔧 Configuration

### Environment Setup

Create a `.env` file in the contracts directory:

```bash
# Copy the example
cp .env.example .env

# Edit with your values
nano .env
```

Required variables:

```
PRIVATE_KEY=your_private_key_without_0x_prefix
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

### Network Configuration

The contracts are configured for **Base Sepolia** testnet. Configuration is in `foundry.toml`:

- RPC URL: `https://sepolia.base.org`
- Chain ID: 84532
- Block Explorer: `https://sepolia.basescan.org`

## 📦 Deployment

### Deploy to Base Sepolia

```bash
# Load environment variables
source .env

# Deploy all contracts
forge script script/Deploy.s.sol \
  --rpc-url $BASE_SEPOLIA_RPC \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY

# Or use the shorthand
forge script script/Deploy.s.sol:Deploy --rpc-url base_sepolia --broadcast --verify
```

### Deployment Script

The deployment script (`script/Deploy.s.sol`) deploys contracts in this order:

1. Treasury
2. GUIToken
3. NFTPostcard
4. YieldRouter
5. SafeMeetFactory
6. GUIStaking

Then configures:

- Adds staking as GUI token minter
- Authorizes factory to mint NFTs
- Links all contracts together

### Post-Deployment

After deployment, save the contract addresses from the console output. They will be needed for:

- Frontend integration
- Admin operations
- User interactions

## 🎯 Contract Features

### GUIToken

- **Max Supply**: 1 billion tokens
- **Initial Supply**: 100 million (10% to deployer)
- **Features**: Mintable, Burnable, Pausable
- **Decimals**: 18

### PuddleVault

- **Share-based accounting** (ERC-4626-like)
- **Configurable lock periods** (default: 7 days)
- **Minimum deposits** (default: 10 USDC)
- **Fee structure**:
  - Deposit fee: 0% (configurable)
  - Withdrawal fee: 0.5% (configurable)
  - Performance fee: 10% (configurable)
  - Emergency withdrawal: 5%

### GUIStaking

- **Base APY**: 10%
- **Staking Tiers**:
  - Flexible: 1x (no lock)
  - Bronze: 1.2x (30 days)
  - Silver: 1.5x (90 days)
  - Gold: 2x (180 days)
  - Diamond: 3x (365 days)
- **Min Stake**: 100 GUI tokens

### SafeMeetFactory

- **Creation Fee**: 0.001 ETH (configurable)
- **Default Parameters**:
  - Lock Period: 7 days
  - Min Deposit: 10 USDC
  - Max Members: 100
- **Tracking**: All puddles are tracked and discoverable

## 📝 Contract Interactions

### Create a Puddle

```solidity
// With custom parameters
factory.createPuddle{value: 0.001 ether}(
    "My Savings Group",
    usdcAddress,
    7 days,        // lock period
    10 * 10**6,    // min deposit (10 USDC)
    50             // max members
);

// With defaults
factory.createPuddleWithDefaults{value: 0.001 ether}(
    "My Savings Group",
    usdcAddress
);
```

### Deposit to Puddle

```solidity
// Approve first
IERC20(usdc).approve(puddleAddress, amount);

// Then deposit
IPuddleVault(puddleAddress).deposit(amount);
```

### Stake GUI Tokens

```solidity
// Approve first
guiToken.approve(stakingAddress, amount);

// Stake with tier
staking.stake(amount, GUIStaking.StakingTier.GOLD); // 180 days, 2x multiplier
```

## 🔐 Security Features

- **ReentrancyGuard**: All state-changing functions protected
- **Pausable**: Emergency pause functionality
- **Access Control**: Owner/admin-only functions
- **SafeERC20**: Protection against token transfer issues
- **Input Validation**: Comprehensive checks on all inputs
- **Fee Limits**: Maximum fees capped to prevent exploitation

## 🛠️ Development

### Compile Contracts

```bash
forge build
```

### Run Tests

```bash
# All tests
forge test

# Specific test
forge test --match-test testDeposit

# With traces
forge test -vvvv
```

### Format Code

```bash
forge fmt
```

### Generate Documentation

```bash
forge doc
```

## 📚 Additional Scripts

### Verify a Contract Manually

```bash
forge verify-contract \
  --chain-id 84532 \
  --compiler-version v0.8.24 \
  <CONTRACT_ADDRESS> \
  src/GUIToken.sol:GUIToken \
  --etherscan-api-key $BASESCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address)" <OWNER_ADDRESS>)
```

### Check Contract Size

```bash
forge build --sizes
```

### Gas Snapshot

```bash
forge snapshot
```

## 🌐 Network Details

### Base Sepolia Testnet

- **Chain ID**: 84532
- **RPC**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

### Useful Addresses on Base Sepolia

- USDC (Mock): Deploy your own or use a testnet version
- Aave Pool: Check Base documentation for testnet addresses
- Other DeFi protocols: Check respective documentation

## 📖 Documentation

For more detailed documentation:

- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Base Documentation](https://docs.base.org/)

## 🤝 Contributing

1. Write tests for new features
2. Ensure all tests pass: `forge test`
3. Format code: `forge fmt`
4. Check for issues: `forge build`

## 📄 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

These contracts are provided as-is. Always conduct thorough testing and auditing before deploying to mainnet.

## 🔗 Links

- Frontend: `../frontend`
- Documentation: `./docs` (to be added)
- Deployment addresses: Check console output after deployment

---

**Built with ❤️ for the SafeMeet community**
