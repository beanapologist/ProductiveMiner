// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MINEDToken is ERC20, Ownable {
    constructor() ERC20("ProductiveMiner Token", "MINED") Ownable() {
        // Mint initial supply to the deployer
        _mint(msg.sender, 1000000 * 10**decimals()); // 1 million MINED tokens
        
        // Pre-fund test accounts
        _mint(0xFfe7a1c2B61eB2bc64d3932F5Db1DA18CF92fFb9, 1000 * 10**decimals()); // 1000 MINED
        _mint(0x111B1c000d6fF7cE7b5e74A51bDA92beEFdcff26, 1000 * 10**decimals()); // 1000 MINED
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
} 