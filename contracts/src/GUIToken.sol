// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GUIToken
 * @notice The native utility token for SafeMeet platform
 * @dev ERC-20 token with minting, burning, and pause functionality
 *
 * Features:
 * - Mintable by authorized contracts (staking, rewards)
 * - Burnable by token holders
 * - Pausable for emergency situations
 * - Capped total supply for tokenomics
 */
contract GUIToken is ERC20, ERC20Burnable, Ownable, Pausable {
    // Maximum supply: 1 billion GUI tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    // Mapping of authorized minters (staking contract, treasury, etc.)
    mapping(address => bool) public minters;

    // Events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @notice Constructor to initialize the GUI token
     * @param initialOwner The address that will own the contract
     */
    constructor(
        address initialOwner
    ) ERC20("SafeMeet GUI Token", "GUI") Ownable(initialOwner) {
        // Mint initial supply to owner for liquidity, airdrops, etc.
        // 10% of max supply (100 million tokens)
        uint256 initialSupply = MAX_SUPPLY / 10;
        _mint(initialOwner, initialSupply);
    }

    /**
     * @notice Adds an address as an authorized minter
     * @param minter The address to authorize
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "GUIToken: zero address");
        require(!minters[minter], "GUIToken: already minter");

        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @notice Removes an address from authorized minters
     * @param minter The address to deauthorize
     */
    function removeMinter(address minter) external onlyOwner {
        require(minters[minter], "GUIToken: not a minter");

        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @notice Mints new tokens (only callable by authorized minters)
     * @param to The address to receive the tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external whenNotPaused {
        require(minters[msg.sender], "GUIToken: not authorized to mint");
        require(to != address(0), "GUIToken: mint to zero address");
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "GUIToken: exceeds max supply"
        );

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @notice Burns tokens from the caller's balance
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) public override whenNotPaused {
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @notice Burns tokens from a specified account (with approval)
     * @param account The account to burn from
     * @param amount The amount to burn
     */
    function burnFrom(
        address account,
        uint256 amount
    ) public override whenNotPaused {
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }

    /**
     * @notice Pauses all token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Hook that is called before any transfer of tokens
     * @dev Implements pause functionality
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override whenNotPaused {
        super._update(from, to, value);
    }

    /**
     * @notice Returns the number of decimals used by the token
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
