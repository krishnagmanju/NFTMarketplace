//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NftToken is ERC20 {
    address admin;


    
    modifier onlyAdmin() {
        require(msg.sender == admin, "is not admin");
        _;
    }
    constructor () ERC20("myToken","MT") {
        admin=msg.sender;
    }

    function mint(address account, uint256 amount) public onlyAdmin {
        _mint(account, amount);
        
    }

    function burn(address account, uint256 amount) public onlyAdmin{
        _burn(account, amount);
    }

    function transferToken (address from,address to, uint256 amount) public onlyAdmin {
        _transfer(from,to,amount);
        
    }

}
