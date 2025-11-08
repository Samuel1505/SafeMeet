// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./GUIToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GUIStaking
 * @notice Staking contract for GUI tokens with auto-compounding rewards
 * @dev Provides staking, reward distribution, and boosted APY functionality
 *
 * Features:
 * - Stake GUI tokens to earn rewards
 * - Auto-compounding rewards
 * - Tiered APY based on staking duration
 * - Boosted rewards for long-term stakers
 * - Emergency withdrawal with penalties
 */
contract GUIStaking is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Structs
    struct StakeInfo {
        uint256 amount; // Amount staked
        uint256 rewardDebt; // Reward debt for fair distribution
        uint256 startTime; // When user started staking
        uint256 lastClaimTime; // Last time rewards were claimed
        uint256 lockEndTime; // End of lock period (if applicable)
        StakingTier tier; // Staking tier
    }

    enum StakingTier {
        FLEXIBLE, // 0 lock, base APY
        BRONZE, // 30 days, 1.2x APY
        SILVER, // 90 days, 1.5x APY
        GOLD, // 180 days, 2x APY
        DIAMOND // 365 days, 3x APY
    }

    // State variables
    GUIToken public guiToken;

    // Staking pools by tier
    mapping(StakingTier => uint256) public totalStakedByTier;
    mapping(address => StakeInfo) public stakes;

    // Reward parameters
    uint256 public baseAPY = 1000; // 10% base APY (in basis points)
    uint256 public rewardsPerSecond;
    uint256 public lastRewardTime;
    uint256 public accRewardPerShare;
    uint256 public totalStaked;

    // Tier multipliers (in basis points, 10000 = 1x)
    mapping(StakingTier => uint256) public tierMultipliers;
    mapping(StakingTier => uint256) public tierLockDurations;

    // Early withdrawal penalty (5%)
    uint256 public earlyWithdrawalPenalty = 500;

    // Treasury for penalties
    address public treasury;

    // Minimum stake amount
    uint256 public minStakeAmount = 100 * 10 ** 18; // 100 GUI tokens

    // Events
    event Staked(address indexed user, uint256 amount, StakingTier tier);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardsCompounded(address indexed user, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 amount,
        uint256 penalty
    );
    event APYUpdated(uint256 newAPY);
    event TierMultiplierUpdated(StakingTier tier, uint256 multiplier);

    /**
     * @notice Constructor to initialize the staking contract
     * @param _guiToken Address of the GUI token
     * @param _treasury Address of the treasury
     * @param initialOwner Owner of the contract
     */
    constructor(
        address _guiToken,
        address _treasury,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_guiToken != address(0), "GUIStaking: zero token address");
        require(_treasury != address(0), "GUIStaking: zero treasury address");

        guiToken = GUIToken(_guiToken);
        treasury = _treasury;
        lastRewardTime = block.timestamp;

        // Initialize tier multipliers
        tierMultipliers[StakingTier.FLEXIBLE] = 10000; // 1x
        tierMultipliers[StakingTier.BRONZE] = 12000; // 1.2x
        tierMultipliers[StakingTier.SILVER] = 15000; // 1.5x
        tierMultipliers[StakingTier.GOLD] = 20000; // 2x
        tierMultipliers[StakingTier.DIAMOND] = 30000; // 3x

        // Initialize lock durations
        tierLockDurations[StakingTier.FLEXIBLE] = 0;
        tierLockDurations[StakingTier.BRONZE] = 30 days;
        tierLockDurations[StakingTier.SILVER] = 90 days;
        tierLockDurations[StakingTier.GOLD] = 180 days;
        tierLockDurations[StakingTier.DIAMOND] = 365 days;

        // Calculate rewards per second (baseAPY / 365 days)
        _updateRewardsPerSecond();
    }

    /**
     * @notice Stakes GUI tokens
     * @param amount Amount to stake
     * @param tier Staking tier to use
     */
    function stake(
        uint256 amount,
        StakingTier tier
    ) external nonReentrant whenNotPaused {
        require(amount >= minStakeAmount, "GUIStaking: below minimum");

        _updatePool();

        StakeInfo storage userStake = stakes[msg.sender];

        // If user already has a stake, claim pending rewards first
        if (userStake.amount > 0) {
            _claimRewards(msg.sender);
        }

        // Transfer tokens from user
        IERC20(address(guiToken)).safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );

        // Update user stake
        userStake.amount += amount;
        userStake.startTime = block.timestamp;
        userStake.lastClaimTime = block.timestamp;
        userStake.tier = tier;
        userStake.lockEndTime = block.timestamp + tierLockDurations[tier];
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e18;

        // Update global stats
        totalStaked += amount;
        totalStakedByTier[tier] += amount;

        emit Staked(msg.sender, amount, tier);
    }

    /**
     * @notice Unstakes GUI tokens
     * @param amount Amount to unstake
     */
    function unstake(uint256 amount) external nonReentrant whenNotPaused {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "GUIStaking: insufficient stake");
        require(
            block.timestamp >= userStake.lockEndTime,
            "GUIStaking: still locked"
        );

        _updatePool();
        _claimRewards(msg.sender);

        // Update user stake
        userStake.amount -= amount;
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e18;

        // Update global stats
        totalStaked -= amount;
        totalStakedByTier[userStake.tier] -= amount;

        // Transfer tokens back to user
        IERC20(address(guiToken)).safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    /**
     * @notice Claims pending rewards
     */
    function claimRewards() external nonReentrant whenNotPaused {
        _updatePool();
        _claimRewards(msg.sender);
    }

    /**
     * @notice Compounds rewards (re-stakes claimed rewards)
     */
    function compoundRewards() external nonReentrant whenNotPaused {
        _updatePool();

        uint256 pending = getPendingRewards(msg.sender);
        require(pending > 0, "GUIStaking: no rewards");

        StakeInfo storage userStake = stakes[msg.sender];

        // Add rewards to stake
        userStake.amount += pending;
        userStake.lastClaimTime = block.timestamp;
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e18;

        // Update global stats
        totalStaked += pending;
        totalStakedByTier[userStake.tier] += pending;

        emit RewardsCompounded(msg.sender, pending);
    }

    /**
     * @notice Emergency withdrawal (bypasses lock, applies penalty)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "GUIStaking: insufficient stake");

        _updatePool();

        // Calculate penalty if still locked
        uint256 penalty = 0;
        if (block.timestamp < userStake.lockEndTime) {
            penalty = (amount * earlyWithdrawalPenalty) / 10000;
        }

        uint256 netAmount = amount - penalty;

        // Forfeit rewards on emergency withdrawal
        userStake.amount -= amount;
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e18;

        // Update global stats
        totalStaked -= amount;
        totalStakedByTier[userStake.tier] -= amount;

        // Transfer tokens
        IERC20(address(guiToken)).safeTransfer(msg.sender, netAmount);

        // Send penalty to treasury
        if (penalty > 0) {
            IERC20(address(guiToken)).safeTransfer(treasury, penalty);
        }

        emit EmergencyWithdraw(msg.sender, netAmount, penalty);
    }

    /**
     * @notice Internal function to claim rewards
     */
    function _claimRewards(address user) internal {
        uint256 pending = getPendingRewards(user);

        if (pending > 0) {
            StakeInfo storage userStake = stakes[user];
            userStake.lastClaimTime = block.timestamp;
            userStake.rewardDebt =
                (userStake.amount * accRewardPerShare) /
                1e18;

            // Mint rewards to user
            guiToken.mint(user, pending);

            emit RewardsClaimed(user, pending);
        }
    }

    /**
     * @notice Updates the reward pool
     */
    function _updatePool() internal {
        if (block.timestamp <= lastRewardTime) {
            return;
        }

        if (totalStaked == 0) {
            lastRewardTime = block.timestamp;
            return;
        }

        uint256 timeElapsed = block.timestamp - lastRewardTime;
        uint256 rewards = timeElapsed * rewardsPerSecond;

        accRewardPerShare += (rewards * 1e18) / totalStaked;
        lastRewardTime = block.timestamp;
    }

    /**
     * @notice Updates rewards per second based on APY
     */
    function _updateRewardsPerSecond() internal {
        // rewardsPerSecond = (totalStaked * baseAPY) / (365 days * 10000)
        if (totalStaked > 0) {
            rewardsPerSecond = (totalStaked * baseAPY) / (365 days * 10000);
        }
    }

    // View functions

    /**
     * @notice Returns pending rewards for a user
     * @param user Address of the user
     * @return Pending reward amount
     */
    function getPendingRewards(address user) public view returns (uint256) {
        StakeInfo memory userStake = stakes[user];

        if (userStake.amount == 0) {
            return 0;
        }

        uint256 _accRewardPerShare = accRewardPerShare;

        if (block.timestamp > lastRewardTime && totalStaked > 0) {
            uint256 timeElapsed = block.timestamp - lastRewardTime;
            uint256 rewards = timeElapsed * rewardsPerSecond;
            _accRewardPerShare += (rewards * 1e18) / totalStaked;
        }

        uint256 baseReward = (userStake.amount * _accRewardPerShare) /
            1e18 -
            userStake.rewardDebt;

        // Apply tier multiplier
        uint256 boostedReward = (baseReward * tierMultipliers[userStake.tier]) /
            10000;

        return boostedReward;
    }

    /**
     * @notice Returns user stake information
     * @param user Address of the user
     */
    function getStakeInfo(
        address user
    )
        external
        view
        returns (
            uint256 amount,
            uint256 startTime,
            uint256 lastClaimTime,
            uint256 lockEndTime,
            StakingTier tier,
            uint256 pendingRewards
        )
    {
        StakeInfo memory userStake = stakes[user];
        return (
            userStake.amount,
            userStake.startTime,
            userStake.lastClaimTime,
            userStake.lockEndTime,
            userStake.tier,
            getPendingRewards(user)
        );
    }

    /**
     * @notice Returns effective APY for a user (including tier boost)
     * @param user Address of the user
     */
    function getEffectiveAPY(address user) external view returns (uint256) {
        StakeInfo memory userStake = stakes[user];
        return (baseAPY * tierMultipliers[userStake.tier]) / 10000;
    }

    /**
     * @notice Returns total value locked
     */
    function getTVL() external view returns (uint256) {
        return totalStaked;
    }

    /**
     * @notice Calculates estimated rewards for a given amount and duration
     * @param amount Amount to stake
     * @param tier Staking tier
     * @param duration Duration in seconds
     */
    function estimateRewards(
        uint256 amount,
        StakingTier tier,
        uint256 duration
    ) external view returns (uint256) {
        uint256 effectiveAPY = (baseAPY * tierMultipliers[tier]) / 10000;
        return (amount * effectiveAPY * duration) / (365 days * 10000);
    }

    // Admin functions

    /**
     * @notice Updates base APY
     * @param newAPY New APY in basis points
     */
    function setBaseAPY(uint256 newAPY) external onlyOwner {
        require(newAPY <= 10000, "GUIStaking: APY too high"); // Max 100%

        _updatePool();
        baseAPY = newAPY;
        _updateRewardsPerSecond();

        emit APYUpdated(newAPY);
    }

    /**
     * @notice Updates tier multiplier
     * @param tier Staking tier
     * @param multiplier New multiplier (in basis points)
     */
    function setTierMultiplier(
        StakingTier tier,
        uint256 multiplier
    ) external onlyOwner {
        require(multiplier >= 10000, "GUIStaking: multiplier < 1x");
        require(multiplier <= 50000, "GUIStaking: multiplier too high"); // Max 5x

        tierMultipliers[tier] = multiplier;
        emit TierMultiplierUpdated(tier, multiplier);
    }

    /**
     * @notice Updates early withdrawal penalty
     * @param penalty New penalty (in basis points)
     */
    function setEarlyWithdrawalPenalty(uint256 penalty) external onlyOwner {
        require(penalty <= 2000, "GUIStaking: penalty too high"); // Max 20%
        earlyWithdrawalPenalty = penalty;
    }

    /**
     * @notice Updates minimum stake amount
     * @param amount New minimum amount
     */
    function setMinStakeAmount(uint256 amount) external onlyOwner {
        minStakeAmount = amount;
    }

    /**
     * @notice Updates treasury address
     * @param _treasury New treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "GUIStaking: zero address");
        treasury = _treasury;
    }

    /**
     * @notice Pauses staking
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses staking
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency recovery of tokens (only owner)
     * @param token Token address
     * @param amount Amount to recover
     */
    function emergencyRecoverToken(
        address token,
        uint256 amount
    ) external onlyOwner {
        require(
            token != address(guiToken),
            "GUIStaking: cannot recover staked token"
        );
        IERC20(token).safeTransfer(owner(), amount);
    }
}
