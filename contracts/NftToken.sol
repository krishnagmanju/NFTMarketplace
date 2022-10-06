//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NftToken is ERC20 {
    address admin;
    address nftMarketplace;

    
    modifier onlyAdmin() {
        require(msg.sender == admin, "is not admin");
        _;
    }
    constructor () ERC20("myToken","MT") {
        admin=msg.sender;
    }

    function setaddress(address nftMarketplace_ ) public {
        nftMarketplace=nftMarketplace_;
    }

    function mint(address account, uint256 amount) public onlyAdmin {
        _mint(account, amount);
        
    }

    function burn(address account, uint256 amount) public onlyAdmin{
        _burn(account, amount);
    }

    function transferToken (address from,address to, uint256 amount) public  {
        require(msg.sender == nftMarketplace,"not nftmarketplace");
        _transfer(from,to,amount);
        
    }

}
