/**
 * SafeMeet Contract ABIs
 * Auto-generated TypeScript ABIs with type safety
 */

export { GUITokenABI } from "./GUIToken";
export { SafeMeetFactoryABI } from "./SafeMeetFactory";
export { PuddleVaultABI } from "./PuddleVault";
export { YieldRouterABI } from "./YieldRouter";
export { GUIStakingABI } from "./GUIStaking";
export { NFTPostcardABI } from "./NFTPostcard";
export { TreasuryABI } from "./Treasury";

// Aggregate export
import { GUITokenABI } from "./GUIToken";
import { SafeMeetFactoryABI } from "./SafeMeetFactory";
import { PuddleVaultABI } from "./PuddleVault";
import { YieldRouterABI } from "./YieldRouter";
import { GUIStakingABI } from "./GUIStaking";
import { NFTPostcardABI } from "./NFTPostcard";
import { TreasuryABI } from "./Treasury";

export const ABIs = {
  GUIToken: GUITokenABI,
  SafeMeetFactory: SafeMeetFactoryABI,
  PuddleVault: PuddleVaultABI,
  YieldRouter: YieldRouterABI,
  GUIStaking: GUIStakingABI,
  NFTPostcard: NFTPostcardABI,
  Treasury: TreasuryABI,
} as const;
