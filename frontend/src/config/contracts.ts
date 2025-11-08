/**
 * SafeMeet Smart Contract Addresses and Configuration
 * Network: Base Sepolia Testnet
 * Chain ID: 84532
 */

export const CHAIN_ID = 84532;
export const NETWORK_NAME = "Base Sepolia";
export const RPC_URL = "https://sepolia.base.org";
export const BLOCK_EXPLORER = "https://sepolia.basescan.org";

/**
 * Deployed Contract Addresses
 * Deployed on: [Add deployment date]
 */
export const CONTRACTS = {
  Treasury: "0xd058Ee5C116166225cB52F2AC251Cc9c27b03948",
  GUIToken: "0xDE48f185ed77bAf3a67B63a9b7DD962A762Ff62E",
  SafeMeetFactory: "0xF6490C95572e59ef76E88B2DcD2636F9E6Fca629",
  YieldRouter: "0x70166c3f73085d1d6116C57E4572402771C225be",
  GUIStaking: "0x64c48F7cd809F89328001050aD5f97940B7b7e21",
  NFTPostcard: "0x124f33f36e195210774C16184680f3bD015AD383",
} as const;

/**
 * Contract Addresses with checksummed format
 */
export const CONTRACT_ADDRESSES = {
  treasury: CONTRACTS.Treasury,
  guiToken: CONTRACTS.GUIToken,
  factory: CONTRACTS.SafeMeetFactory,
  yieldRouter: CONTRACTS.YieldRouter,
  staking: CONTRACTS.GUIStaking,
  nftPostcard: CONTRACTS.NFTPostcard,
} as const;

/**
 * Block Explorer Links
 */
export const getExplorerLink = (
  address: string,
  type: "address" | "tx" = "address"
) => {
  const baseUrl = BLOCK_EXPLORER;
  return `${baseUrl}/${type}/${address}`;
};

/**
 * Contract Configuration
 */
export const CONTRACT_CONFIG = {
  // GUI Token
  guiToken: {
    address: CONTRACTS.GUIToken,
    decimals: 18,
    symbol: "GUI",
    name: "SafeMeet GUI Token",
    maxSupply: "1000000000", // 1 billion
  },

  // Factory
  factory: {
    address: CONTRACTS.SafeMeetFactory,
    creationFee: "0.001", // ETH
    defaultLockPeriod: 7 * 24 * 60 * 60, // 7 days in seconds
    defaultMinDeposit: "10", // USDC
    defaultMaxMembers: 100,
  },

  // Staking
  staking: {
    address: CONTRACTS.GUIStaking,
    baseAPY: 10, // 10%
    minStake: "100", // 100 GUI tokens
    tiers: {
      FLEXIBLE: { multiplier: 1.0, lockDays: 0 },
      BRONZE: { multiplier: 1.2, lockDays: 30 },
      SILVER: { multiplier: 1.5, lockDays: 90 },
      GOLD: { multiplier: 2.0, lockDays: 180 },
      DIAMOND: { multiplier: 3.0, lockDays: 365 },
    },
  },

  // Yield Router
  yieldRouter: {
    address: CONTRACTS.YieldRouter,
    supportedProtocols: ["AAVE", "COMPOUND"], // Add as configured
  },

  // NFT Postcard
  nftPostcard: {
    address: CONTRACTS.NFTPostcard,
    name: "SafeMeet Postcard",
    symbol: "SMPC",
  },

  // Treasury
  treasury: {
    address: CONTRACTS.Treasury,
    allocationConfig: {
      development: 30, // 30%
      marketing: 20, // 20%
      operations: 20, // 20%
      reserve: 20, // 20%
      buyback: 10, // 10%
    },
  },
} as const;

/**
 * Network Configuration
 */
export const NETWORK_CONFIG = {
  chainId: CHAIN_ID,
  chainName: NETWORK_NAME,
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: [BLOCK_EXPLORER],
} as const;

/**
 * Common Stablecoin Addresses on Base Sepolia
 * Note: Update these with actual testnet addresses or deploy your own
 */
export const STABLECOINS = {
  // Add your deployed mock USDC or testnet stablecoin addresses here
  USDC: "0x...", // Update with actual address
  USDT: "0x...", // Update with actual address
} as const;

/**
 * Helper function to check if current network is correct
 */
export const isCorrectNetwork = (chainId: number): boolean => {
  return chainId === CHAIN_ID;
};

/**
 * Helper to format contract address for display
 */
export const formatAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Type exports
 */
export type ContractName = keyof typeof CONTRACTS;
export type ContractAddress = (typeof CONTRACTS)[ContractName];
export type StakingTier = keyof typeof CONTRACT_CONFIG.staking.tiers;
