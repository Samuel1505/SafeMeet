// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title YieldRouter
 * @notice Routes pooled stablecoins to external DeFi protocols for optimal yield
 * @dev Integrates with Aave, Compound, and other Base DeFi protocols
 *
 * Features:
 * - Multi-protocol support (Aave, Compound, Aerodrome, etc.)
 * - Automatic rebalancing for optimal yields
 * - Safety checks and emergency withdrawals
 * - Yield tracking and reporting
 */
contract YieldRouter is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Structs
    struct ProtocolAdapter {
        address adapterAddress;
        bool isActive;
        uint256 allocation; // Allocation percentage (in basis points, 10000 = 100%)
        uint256 totalDeposited; // Total amount deposited in this protocol
        uint256 currentAPY; // Current APY (in basis points)
    }

    struct YieldStrategy {
        string name;
        address[] protocols;
        uint256[] allocations;
        bool isActive;
    }

    // State variables
    address public factory;
    address public treasury;

    // Supported stablecoins
    mapping(address => bool) public supportedStablecoins;
    address[] public stablecoinList;

    // Protocol adapters (e.g., "AAVE" => adapter details)
    mapping(string => ProtocolAdapter) public protocolAdapters;
    string[] public protocolNames;

    // Yield strategies
    mapping(uint256 => YieldStrategy) public strategies;
    uint256 public strategyCount;
    uint256 public activeStrategyId;

    // Puddle vault allocations
    mapping(address => mapping(address => uint256)) public vaultBalances; // vault => token => balance

    // Safety parameters
    uint256 public constant MAX_PROTOCOLS = 5;
    uint256 public constant MIN_REBALANCE_INTERVAL = 1 hours;
    uint256 public lastRebalanceTime;
    uint256 public rebalanceThreshold = 200; // 2% difference triggers rebalance

    // Events
    event ProtocolAdded(string indexed protocolName, address adapter);
    event ProtocolRemoved(string indexed protocolName);
    event ProtocolUpdated(
        string indexed protocolName,
        uint256 newAllocation,
        uint256 newAPY
    );
    event Deposited(
        address indexed vault,
        address indexed token,
        uint256 amount,
        string protocol
    );
    event Withdrawn(
        address indexed vault,
        address indexed token,
        uint256 amount,
        string protocol
    );
    event Rebalanced(uint256 timestamp, uint256 totalValue);
    event YieldHarvested(address indexed vault, uint256 amount);
    event StrategyActivated(uint256 indexed strategyId);
    event EmergencyWithdrawal(address indexed token, uint256 amount);

    /**
     * @notice Constructor to initialize the yield router
     * @param initialOwner Owner of the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        lastRebalanceTime = block.timestamp;
    }

    /**
     * @notice Adds a supported stablecoin
     * @param token Address of the stablecoin
     */
    function addSupportedStablecoin(address token) external onlyOwner {
        require(token != address(0), "YieldRouter: zero address");
        require(!supportedStablecoins[token], "YieldRouter: already supported");

        supportedStablecoins[token] = true;
        stablecoinList.push(token);
    }

    /**
     * @notice Adds a new protocol adapter
     * @param protocolName Name of the protocol (e.g., "AAVE")
     * @param adapterAddress Address of the adapter contract
     * @param initialAllocation Initial allocation percentage
     */
    function addProtocol(
        string memory protocolName,
        address adapterAddress,
        uint256 initialAllocation
    ) external onlyOwner {
        require(adapterAddress != address(0), "YieldRouter: zero address");
        require(
            protocolAdapters[protocolName].adapterAddress == address(0),
            "YieldRouter: protocol exists"
        );
        require(
            protocolNames.length < MAX_PROTOCOLS,
            "YieldRouter: max protocols reached"
        );
        require(initialAllocation <= 10000, "YieldRouter: allocation > 100%");

        protocolAdapters[protocolName] = ProtocolAdapter({
            adapterAddress: adapterAddress,
            isActive: true,
            allocation: initialAllocation,
            totalDeposited: 0,
            currentAPY: 0
        });

        protocolNames.push(protocolName);
        emit ProtocolAdded(protocolName, adapterAddress);
    }

    /**
     * @notice Updates protocol allocation and APY
     * @param protocolName Name of the protocol
     * @param newAllocation New allocation percentage
     * @param newAPY New APY (in basis points)
     */
    function updateProtocol(
        string memory protocolName,
        uint256 newAllocation,
        uint256 newAPY
    ) external onlyOwner {
        require(
            protocolAdapters[protocolName].adapterAddress != address(0),
            "YieldRouter: protocol not found"
        );

        protocolAdapters[protocolName].allocation = newAllocation;
        protocolAdapters[protocolName].currentAPY = newAPY;

        emit ProtocolUpdated(protocolName, newAllocation, newAPY);
    }

    /**
     * @notice Deactivates a protocol
     * @param protocolName Name of the protocol
     */
    function deactivateProtocol(string memory protocolName) external onlyOwner {
        require(
            protocolAdapters[protocolName].adapterAddress != address(0),
            "YieldRouter: protocol not found"
        );

        protocolAdapters[protocolName].isActive = false;
        emit ProtocolRemoved(protocolName);
    }

    /**
     * @notice Deposits funds into yield-generating protocols
     * @param token Address of the token to deposit
     * @param amount Amount to deposit
     * @param protocolName Target protocol name
     */
    function deposit(
        address token,
        uint256 amount,
        string memory protocolName
    ) external nonReentrant whenNotPaused {
        require(
            supportedStablecoins[token],
            "YieldRouter: token not supported"
        );
        require(amount > 0, "YieldRouter: zero amount");

        ProtocolAdapter storage protocol = protocolAdapters[protocolName];
        require(protocol.isActive, "YieldRouter: protocol not active");
        require(
            protocol.adapterAddress != address(0),
            "YieldRouter: protocol not found"
        );

        // Transfer tokens from vault to this contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Update balances
        vaultBalances[msg.sender][token] += amount;
        protocol.totalDeposited += amount;

        // Approve protocol adapter
        IERC20(token).safeIncreaseAllowance(protocol.adapterAddress, amount);

        // Note: In production, this would call the actual protocol adapter
        // For now, we'll keep funds in this contract as a placeholder
        // Example: IProtocolAdapter(protocol.adapterAddress).deposit(token, amount);

        emit Deposited(msg.sender, token, amount, protocolName);
    }

    /**
     * @notice Withdraws funds from yield protocols
     * @param token Address of the token to withdraw
     * @param amount Amount to withdraw
     * @param protocolName Source protocol name
     */
    function withdraw(
        address token,
        uint256 amount,
        string memory protocolName
    ) external nonReentrant whenNotPaused {
        require(
            vaultBalances[msg.sender][token] >= amount,
            "YieldRouter: insufficient balance"
        );

        ProtocolAdapter storage protocol = protocolAdapters[protocolName];
        require(
            protocol.adapterAddress != address(0),
            "YieldRouter: protocol not found"
        );

        // Update balances
        vaultBalances[msg.sender][token] -= amount;
        protocol.totalDeposited -= amount;

        // Note: In production, this would call the actual protocol adapter
        // Example: IProtocolAdapter(protocol.adapterAddress).withdraw(token, amount);

        // Transfer tokens back to vault
        IERC20(token).safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, token, amount, protocolName);
    }

    /**
     * @notice Harvests yield from all protocols for a specific vault
     * @param vault Address of the vault
     * @param token Address of the token
     */
    function harvestYield(
        address vault,
        address token
    ) external nonReentrant returns (uint256) {
        require(
            supportedStablecoins[token],
            "YieldRouter: token not supported"
        );

        uint256 currentBalance = vaultBalances[vault][token];
        uint256 actualBalance = _getActualBalance(vault, token);

        if (actualBalance > currentBalance) {
            uint256 yield = actualBalance - currentBalance;
            vaultBalances[vault][token] = actualBalance;

            emit YieldHarvested(vault, yield);
            return yield;
        }

        return 0;
    }

    /**
     * @notice Rebalances funds across protocols based on current allocations
     * @param token Address of the token to rebalance
     */
    function rebalance(address token) external onlyOwner nonReentrant {
        require(
            block.timestamp >= lastRebalanceTime + MIN_REBALANCE_INTERVAL,
            "YieldRouter: too soon"
        );
        require(
            supportedStablecoins[token],
            "YieldRouter: token not supported"
        );

        uint256 totalBalance = IERC20(token).balanceOf(address(this));

        // Calculate target allocations for each protocol
        for (uint256 i = 0; i < protocolNames.length; i++) {
            string memory protocolName = protocolNames[i];
            ProtocolAdapter storage protocol = protocolAdapters[protocolName];

            if (!protocol.isActive) continue;

            uint256 targetAmount = (totalBalance * protocol.allocation) / 10000;
            uint256 currentAmount = protocol.totalDeposited;

            // Rebalance if difference exceeds threshold
            if (_shouldRebalance(currentAmount, targetAmount, totalBalance)) {
                if (targetAmount > currentAmount) {
                    // Deposit more
                    uint256 depositAmount = targetAmount - currentAmount;
                    _depositToProtocol(token, depositAmount, protocolName);
                } else {
                    // Withdraw excess
                    uint256 withdrawAmount = currentAmount - targetAmount;
                    _withdrawFromProtocol(token, withdrawAmount, protocolName);
                }
            }
        }

        lastRebalanceTime = block.timestamp;
        emit Rebalanced(block.timestamp, totalBalance);
    }

    /**
     * @notice Checks if rebalancing is needed
     * @param current Current amount
     * @param target Target amount
     * @param total Total balance
     */
    function _shouldRebalance(
        uint256 current,
        uint256 target,
        uint256 total
    ) internal view returns (bool) {
        if (total == 0) return false;

        uint256 difference = current > target
            ? current - target
            : target - current;
        uint256 differencePercentage = (difference * 10000) / total;

        return differencePercentage >= rebalanceThreshold;
    }

    /**
     * @notice Internal function to deposit to protocol
     */
    function _depositToProtocol(
        address token,
        uint256 amount,
        string memory protocolName
    ) internal {
        ProtocolAdapter storage protocol = protocolAdapters[protocolName];

        IERC20(token).safeIncreaseAllowance(protocol.adapterAddress, amount);
        protocol.totalDeposited += amount;

        // Note: Call actual adapter here
        // IProtocolAdapter(protocol.adapterAddress).deposit(token, amount);
    }

    /**
     * @notice Internal function to withdraw from protocol
     */
    function _withdrawFromProtocol(
        address token,
        uint256 amount,
        string memory protocolName
    ) internal {
        ProtocolAdapter storage protocol = protocolAdapters[protocolName];

        protocol.totalDeposited -= amount;

        // Note: Call actual adapter here
        // IProtocolAdapter(protocol.adapterAddress).withdraw(token, amount);
    }

    /**
     * @notice Gets actual balance including yield
     */
    function _getActualBalance(
        address vault,
        address token
    ) internal view returns (uint256) {
        // In production, this would query all protocol adapters
        // For now, return recorded balance
        return vaultBalances[vault][token];
    }

    /**
     * @notice Emergency withdrawal of all funds
     * @param token Address of the token
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "YieldRouter: no balance");

        IERC20(token).safeTransfer(owner(), balance);
        emit EmergencyWithdrawal(token, balance);
    }

    // View functions

    /**
     * @notice Returns the total value locked in a specific protocol
     * @param protocolName Name of the protocol
     */
    function getProtocolTVL(
        string memory protocolName
    ) external view returns (uint256) {
        return protocolAdapters[protocolName].totalDeposited;
    }

    /**
     * @notice Returns current APY for a protocol
     * @param protocolName Name of the protocol
     */
    function getProtocolAPY(
        string memory protocolName
    ) external view returns (uint256) {
        return protocolAdapters[protocolName].currentAPY;
    }

    /**
     * @notice Returns all active protocols
     */
    function getActiveProtocols() external view returns (string[] memory) {
        uint256 activeCount = 0;

        // Count active protocols
        for (uint256 i = 0; i < protocolNames.length; i++) {
            if (protocolAdapters[protocolNames[i]].isActive) {
                activeCount++;
            }
        }

        // Build array of active protocols
        string[] memory active = new string[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < protocolNames.length; i++) {
            if (protocolAdapters[protocolNames[i]].isActive) {
                active[index] = protocolNames[i];
                index++;
            }
        }

        return active;
    }

    /**
     * @notice Returns vault balance for a specific token
     */
    function getVaultBalance(
        address vault,
        address token
    ) external view returns (uint256) {
        return vaultBalances[vault][token];
    }

    // Admin functions

    /**
     * @notice Sets the treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "YieldRouter: zero address");
        treasury = _treasury;
    }

    /**
     * @notice Sets the factory address
     */
    function setFactory(address _factory) external onlyOwner {
        require(_factory != address(0), "YieldRouter: zero address");
        factory = _factory;
    }

    /**
     * @notice Updates rebalance threshold
     */
    function setRebalanceThreshold(uint256 _threshold) external onlyOwner {
        require(_threshold <= 1000, "YieldRouter: threshold too high"); // Max 10%
        rebalanceThreshold = _threshold;
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
