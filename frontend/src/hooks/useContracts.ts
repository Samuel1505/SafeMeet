/**
 * Custom hook for interacting with SafeMeet contracts
 * Usage example with wagmi or ethers
 */

import { CONTRACTS, CONTRACT_CONFIG, getExplorerLink } from "@/config/contracts";

/**
 * Hook to get contract addresses
 */
export const useContractAddresses = () => {
  return {
    treasury: CONTRACTS.Treasury,
    guiToken: CONTRACTS.GUIToken,
    factory: CONTRACTS.SafeMeetFactory,
    yieldRouter: CONTRACTS.YieldRouter,
    staking: CONTRACTS.GUIStaking,
    nftPostcard: CONTRACTS.NFTPostcard,
  };
};

/**
 * Hook to get contract configuration
 */
export const useContractConfig = () => {
  return CONTRACT_CONFIG;
};

/**
 * Hook to get staking tiers
 */
export const useStakingTiers = () => {
  return CONTRACT_CONFIG.staking.tiers;
};

/**
 * Calculate effective APY for a staking tier
 */
export const useCalculateAPY = () => {
  const baseAPY = CONTRACT_CONFIG.staking.baseAPY;

  return (tier: keyof typeof CONTRACT_CONFIG.staking.tiers) => {
    const multiplier = CONTRACT_CONFIG.staking.tiers[tier].multiplier;
    return baseAPY * multiplier;
  };
};

/**
 * Get explorer link for address or transaction
 */
export const useExplorerLink = () => {
  return (address: string, type: "address" | "tx" = "address") => {
    return getExplorerLink(address, type);
  };
};

/**
 * Format large numbers for display
 */
export const useFormatNumber = () => {
  return (value: string | number, decimals = 2) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(decimals)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(decimals)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(decimals)}K`;
    }
    
    return num.toFixed(decimals);
  };
};

/**
 * Example: Hook to interact with Factory contract
 * (You'll need to add wagmi/ethers imports and setup)
 */
export const useFactoryContract = () => {
  const address = CONTRACTS.SafeMeetFactory;
  
  // Example function - implement with your web3 library
  const createPuddle = async (
    name: string,
    stablecoin: string,
    lockPeriod?: number,
    minDeposit?: number,
    maxMembers?: number
  ) => {
    // Implement with wagmi's useContractWrite or ethers
    console.log("Creating puddle:", { name, stablecoin, lockPeriod, minDeposit, maxMembers });
    
    // Example:
    // const { write } = useContractWrite({
    //   address,
    //   abi: FactoryABI,
    //   functionName: 'createPuddle',
    // });
    // return write({ args: [name, stablecoin, lockPeriod, minDeposit, maxMembers] });
  };

  return {
    address,
    createPuddle,
  };
};

/**
 * Example: Hook to interact with GUIToken contract
 */
export const useGUIToken = () => {
  const address = CONTRACTS.GUIToken;
  const config = CONTRACT_CONFIG.guiToken;

  return {
    address,
    symbol: config.symbol,
    decimals: config.decimals,
    name: config.name,
    maxSupply: config.maxSupply,
  };
};

/**
 * Example: Hook to interact with Staking contract
 */
export const useStaking = () => {
  const address = CONTRACTS.GUIStaking;
  const config = CONTRACT_CONFIG.staking;

  return {
    address,
    baseAPY: config.baseAPY,
    minStake: config.minStake,
    tiers: config.tiers,
  };
};

