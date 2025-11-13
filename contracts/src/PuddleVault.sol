// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PuddleVault
 * @notice Core savings contract for SafeMeet group savings pools ("puddles")
 * @dev Manages deposits, withdrawals, and share-based accounting for a single puddle
 *
 * Features:
 * - ERC-4626-like vault mechanics with shares
 * - Multiple stablecoin support
 * - Integration with YieldRouter for yield generation
 * - Withdrawal lock periods for savings discipline
 * - Emergency withdrawal functionality
 */
contract PuddleVault is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Structs
    struct UserDeposit {
        uint256 shares; // User's share of the puddle
        uint256 totalDeposited; // Total amount deposited (for tracking)
        uint256 lastDepositTime; // Timestamp of last deposit
        bool hasDeposited; // Flag for first-time depositor (for NFT minting)
    }

    // State variables
    string public puddleName;
    address public factory;
    address public yieldRouter;
    address public treasury;
    address public nftPostcard;

    // Supported stablecoin
    IERC20 public stablecoin;

    // Vault accounting
    uint256 public totalShares;
    uint256 public totalAssets;

    // Puddle parameters
    uint256 public lockPeriod; // Time before withdrawals allowed (e.g., 7 days)
    uint256 public minDepositAmount; // Minimum deposit amount
    uint256 public maxMembers; // Maximum number of members
    uint256 public memberCount; // Current number of members

    // Fee parameters (in basis points, 100 = 1%)
    uint256 public depositFee = 0; // Fee on deposits (0% initially)
    uint256 public withdrawalFee = 50; // Fee on withdrawals (0.5%)
    uint256 public performanceFee = 1000; // Fee on yield (10%)

    // Mappings
    mapping(address => UserDeposit) public userDeposits;
    address[] public members;

    // Events
    event Deposited(address indexed user, uint256 amount, uint256 shares);
    event Withdrawn(address indexed user, uint256 amount, uint256 shares);
    event YieldHarvested(uint256 amount, uint256 performanceFeeAmount);
    event LockPeriodUpdated(uint256 newLockPeriod);
    event EmergencyWithdrawal(address indexed user, uint256 amount);
    event YieldRouterUpdated(address indexed newRouter);

    // Modifiers
    modifier onlyFactory() {
        require(msg.sender == factory, "PuddleVault: only factory");
        _;
    }

    /**
     * @notice Constructor to initialize the puddle vault
     * @param _name Name of the puddle
     * @param _stablecoin Address of the stablecoin (USDC, USDT, etc.)
     * @param _owner Owner of the puddle
     * @param _factory Factory contract address
     * @param _lockPeriod Lock period in seconds
     * @param _minDepositAmount Minimum deposit amount
     * @param _maxMembers Maximum number of members allowed
     */
    constructor(
        string memory _name,
        address _stablecoin,
        address _owner,
        address _factory,
        uint256 _lockPeriod,
        uint256 _minDepositAmount,
        uint256 _maxMembers
    ) Ownable(_owner) {
        require(_stablecoin != address(0), "PuddleVault: zero address");
        require(_factory != address(0), "PuddleVault: zero factory");

        puddleName = _name;
        stablecoin = IERC20(_stablecoin);
        factory = _factory;
        lockPeriod = _lockPeriod;
        minDepositAmount = _minDepositAmount;
        maxMembers = _maxMembers;
    }

    /**
     * @notice Deposits stablecoins into the puddle
     * @param amount Amount to deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(
            amount >= minDepositAmount,
            "PuddleVault: below minimum deposit"
        );
        require(
            memberCount < maxMembers || userDeposits[msg.sender].hasDeposited,
            "PuddleVault: max members reached"
        );

        // Track new members
        if (!userDeposits[msg.sender].hasDeposited) {
            members.push(msg.sender);
            memberCount++;
            userDeposits[msg.sender].hasDeposited = true;
        }

        // Calculate deposit fee
        uint256 fee = (amount * depositFee) / 10000;
        uint256 netAmount = amount - fee;

        // Calculate shares to mint
        uint256 shares = _calculateShares(netAmount);

        // Update state
        userDeposits[msg.sender].shares += shares;
        userDeposits[msg.sender].totalDeposited += netAmount;
        userDeposits[msg.sender].lastDepositTime = block.timestamp;
        totalShares += shares;
        totalAssets += netAmount;

        // Transfer tokens
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);

        // Send fee to treasury if applicable
        if (fee > 0 && treasury != address(0)) {
            stablecoin.safeTransfer(treasury, fee);
        }

        emit Deposited(msg.sender, netAmount, shares);
    }

    /**
     * @notice Withdraws stablecoins from the puddle
     * @param shares Amount of shares to redeem
     */
    function withdraw(uint256 shares) external nonReentrant whenNotPaused {
        UserDeposit storage userDeposit = userDeposits[msg.sender];
        require(
            userDeposit.shares >= shares,
            "PuddleVault: insufficient shares"
        );
        require(
            block.timestamp >= userDeposit.lastDepositTime + lockPeriod,
            "PuddleVault: lock period not expired"
        );

        // Calculate amount to withdraw
        uint256 amount = _calculateAssets(shares);
        require(amount <= totalAssets, "PuddleVault: insufficient assets");

        // Calculate withdrawal fee
        uint256 fee = (amount * withdrawalFee) / 10000;
        uint256 netAmount = amount - fee;

        // Update state
        userDeposit.shares -= shares;
        totalShares -= shares;
        totalAssets -= amount;

        // Transfer tokens
        stablecoin.safeTransfer(msg.sender, netAmount);

        // Send fee to treasury if applicable
        if (fee > 0 && treasury != address(0)) {
            stablecoin.safeTransfer(treasury, fee);
        }

        emit Withdrawn(msg.sender, netAmount, shares);
    }

    /**
     * @notice Emergency withdrawal (bypasses lock period, higher fee)
     * @param shares Amount of shares to redeem
     */
    function emergencyWithdraw(uint256 shares) external nonReentrant {
        UserDeposit storage userDeposit = userDeposits[msg.sender];
        require(
            userDeposit.shares >= shares,
            "PuddleVault: insufficient shares"
        );

        // Calculate amount to withdraw
        uint256 amount = _calculateAssets(shares);
        require(amount <= totalAssets, "PuddleVault: insufficient assets");

        // Higher emergency fee (5%)
        uint256 fee = (amount * 500) / 10000;
        uint256 netAmount = amount - fee;

        // Update state
        userDeposit.shares -= shares;
        totalShares -= shares;
        totalAssets -= amount;

        // Transfer tokens
        stablecoin.safeTransfer(msg.sender, netAmount);

        // Send fee to treasury
        if (treasury != address(0)) {
            stablecoin.safeTransfer(treasury, fee);
        }

        emit EmergencyWithdrawal(msg.sender, netAmount);
    }

    /**
     * @notice Harvests yield from the yield router
     * @dev Only callable by owner or yield router
     */
    function harvestYield() external nonReentrant {
        require(
            msg.sender == owner() || msg.sender == yieldRouter,
            "PuddleVault: not authorized"
        );
        require(yieldRouter != address(0), "PuddleVault: no yield router");

        // Get current balance
        uint256 currentBalance = stablecoin.balanceOf(address(this));

        // Calculate yield (current balance minus total assets)
        if (currentBalance > totalAssets) {
            uint256 yield = currentBalance - totalAssets;

            // Calculate performance fee
            uint256 fee = (yield * performanceFee) / 10000;
            uint256 netYield = yield - fee;

            // Add net yield to total assets
            totalAssets += netYield;

            // Send fee to treasury
            if (fee > 0 && treasury != address(0)) {
                stablecoin.safeTransfer(treasury, fee);
            }

            emit YieldHarvested(netYield, fee);
        }
    }

    /**
     * @notice Transfers funds to yield router for yield generation
     * @param amount Amount to transfer
     */
    function transferToYieldRouter(uint256 amount) external onlyOwner {
        require(yieldRouter != address(0), "PuddleVault: no yield router");
        require(
            amount <= stablecoin.balanceOf(address(this)),
            "PuddleVault: insufficient balance"
        );

        stablecoin.safeTransfer(yieldRouter, amount);
    }

    /**
     * @notice Calculates shares to mint for a given deposit amount
     * @param assets Amount of assets being deposited
     * @return shares Amount of shares to mint
     */
    function _calculateShares(
        uint256 assets
    ) internal view returns (uint256 shares) {
        if (totalShares == 0 || totalAssets == 0) {
            // Initial deposit: 1:1 ratio
            return assets;
        }

        // shares = (assets * totalShares) / totalAssets
        return (assets * totalShares) / totalAssets;
    }

    /**
     * @notice Calculates assets to return for a given amount of shares
     * @param shares Amount of shares being redeemed
     * @return assets Amount of assets to return
     */
    function _calculateAssets(
        uint256 shares
    ) internal view returns (uint256 assets) {
        if (totalShares == 0) {
            return 0;
        }

        // assets = (shares * totalAssets) / totalShares
        return (shares * totalAssets) / totalShares;
    }

    // View functions

    /**
     * @notice Returns the balance of a user in assets
     * @param user Address of the user
     * @return balance User's balance in asset terms
     */
    function balanceOf(address user) external view returns (uint256) {
        return _calculateAssets(userDeposits[user].shares);
    }

    /**
     * @notice Returns user's share balance
     * @param user Address of the user
     * @return shares User's share balance
     */
    function sharesOf(address user) external view returns (uint256) {
        return userDeposits[user].shares;
    }

    /**
     * @notice Preview deposit - calculates shares for a given amount
     * @param assets Amount to deposit
     * @return shares Shares that would be minted
     */
    function previewDeposit(uint256 assets) external view returns (uint256) {
        uint256 fee = (assets * depositFee) / 10000;
        uint256 netAmount = assets - fee;
        return _calculateShares(netAmount);
    }

    /**
     * @notice Preview withdrawal - calculates assets for given shares
     * @param shares Shares to redeem
     * @return assets Assets that would be returned
     */
    function previewWithdraw(uint256 shares) external view returns (uint256) {
        uint256 amount = _calculateAssets(shares);
        uint256 fee = (amount * withdrawalFee) / 10000;
        return amount - fee;
    }

    /**
     * @notice Returns list of all members
     * @return Array of member addresses
     */
    function getMembers() external view returns (address[] memory) {
        return members;
    }

    // Admin functions

    /**
     * @notice Sets the yield router address
     * @param _yieldRouter Address of the yield router
     */
    function setYieldRouter(address _yieldRouter) external onlyOwner {
        require(_yieldRouter != address(0), "PuddleVault: zero address");
        yieldRouter = _yieldRouter;
        emit YieldRouterUpdated(_yieldRouter);
    }

    /**
     * @notice Sets the treasury address
     * @param _treasury Address of the treasury
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "PuddleVault: zero address");
        treasury = _treasury;
    }

    /**
     * @notice Sets the NFT postcard contract address
     * @param _nftPostcard Address of the NFT contract
     */
    function setNFTPostcard(address _nftPostcard) external onlyOwner {
        require(_nftPostcard != address(0), "PuddleVault: zero address");
        nftPostcard = _nftPostcard;
    }

    /**
     * @notice Updates the lock period
     * @param _lockPeriod New lock period in seconds
     */
    function setLockPeriod(uint256 _lockPeriod) external onlyOwner {
        lockPeriod = _lockPeriod;
        emit LockPeriodUpdated(_lockPeriod);
    }

    /**
     * @notice Updates fee parameters
     * @param _depositFee New deposit fee (in basis points)
     * @param _withdrawalFee New withdrawal fee (in basis points)
     * @param _performanceFee New performance fee (in basis points)
     */
    function setFees(
        uint256 _depositFee,
        uint256 _withdrawalFee,
        uint256 _performanceFee
    ) external onlyOwner {
        require(_depositFee <= 500, "PuddleVault: deposit fee too high"); // Max 5%
        require(_withdrawalFee <= 500, "PuddleVault: withdrawal fee too high"); // Max 5%
        require(
            _performanceFee <= 2000,
            "PuddleVault: performance fee too high"
        ); // Max 20%

        depositFee = _depositFee;
        withdrawalFee = _withdrawalFee;
        performanceFee = _performanceFee;
    }

    /**
     * @notice Pauses the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
