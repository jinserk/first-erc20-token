pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";

contract EunToken is ERC20Detailed, ERC20Burnable, ERC20Mintable, ERC20Pausable {
    // define constants
    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 10000000000 * (10 ** uint256(DECIMALS));

    /**
     * @dev Constructor that gives msg.sender all of existing tokens
     */
    constructor() public ERC20Detailed("Eun Token", "EUN", DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
