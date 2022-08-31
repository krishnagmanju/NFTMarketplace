//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract NftMarketplace {
    struct NftMarket {
        address owners;
        bool isForSelling;
    }

    event payout(address recipient, uint256 amount);

    address public admin;
    uint256 public servicefeepercentage;

    mapping(uint256 => NftMarket) public Nfts;

    constructor(uint256 _servicefeepercentage) {
        admin = msg.sender;
        servicefeepercentage = _servicefeepercentage;
    }

    function createNFT(uint256 tokenId, bool isForSelling) public {
        require(Nfts[tokenId].owners == address(0), "token exist");

        Nfts[tokenId] = NftMarket(msg.sender, isForSelling);
    }

    function ownerOfNFT(uint256 _tokenId) public view returns (address) {
        return Nfts[_tokenId].owners;
    }

    function putForSale(uint256 _tokenId) public {
        require(Nfts[_tokenId].isForSelling == false, "already for sale");
        Nfts[_tokenId].isForSelling = true;
    }

    function buyNFT(uint256 _tokenId) public payable {
        require(Nfts[_tokenId].owners != address(0), "token doesnt exist");
        require(Nfts[_tokenId].isForSelling == true, "Not for sale");

        uint256 adminamount = (msg.value * servicefeepercentage) / (100);
        uint256 owneramount = msg.value - adminamount;

        payable(admin).transfer(adminamount);
        emit payout(admin,adminamount);
        payable(Nfts[_tokenId].owners).transfer(owneramount);
        emit payout(Nfts[_tokenId].owners,owneramount);

        Nfts[_tokenId].owners = msg.sender;
        Nfts[_tokenId].isForSelling = false; 
    }
}