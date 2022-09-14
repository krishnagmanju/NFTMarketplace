//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

interface Tokentransfer {
    function transferToken (address from,address to, uint amount) external;
    function balanceOf(address account) external returns (uint256);
    function allowance(address owner, address spender) external returns (uint256);
}




