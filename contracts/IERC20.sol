//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

interface Tokentransfer {
    function transferToken (address from,address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external returns (uint256);

}




