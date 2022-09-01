
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NftMarketplace } from "../typechain-types";

describe("nftMarketplace", function () {
    let contract: NftMarketplace;
    let owner1: SignerWithAddress;
    let owner2: SignerWithAddress;

    //contract deployment
    beforeEach(async () => {
        [owner1, owner2] = await ethers.getSigners();

        const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
        contract = await NftMarketplace.deploy(10);
    });

    describe("createNFT", async () => {
        it("creating NFT", async () => {
            await contract.deployed();
            const createNFT = await contract.connect(owner1).createNFT(4, false);
            await createNFT.wait();
            expect(await contract.ownerOfNFT(4)).to.equal(owner1.address)
        });

    });

    describe("putForSale", async () => {
        it("For sale", async () => {
            await contract.deployed();
            const createNFT = await contract.connect(owner1).createNFT(4, false);
            await createNFT.wait();
            expect(await contract.ownerOfNFT(4)).to.equal(owner1.address)

            const putForSale = await contract.connect(owner1).putForSale(4);
            await putForSale.wait();
            const nftdetails = await contract.Nfts(4)
            expect(nftdetails.isForSelling).to.equal(true)
        });

    });

    describe("buyNFT", async () => {
        it("buying NFT", async () => {
            await contract.deployed();
            const createNFT = await contract.connect(owner1).createNFT(4, false);
            await createNFT.wait();
            expect(await contract.ownerOfNFT(4)).to.equal(owner1.address)

            const putForSale = await contract.connect(owner1).putForSale(4);
            await putForSale.wait();
            const nftdetails = await contract.Nfts(4)
            expect(nftdetails.isForSelling).to.equal(true)

            const buyNFT = await contract.connect(owner2).buyNFT(4);
            await buyNFT.wait();
            expect(await contract.ownerOfNFT(4)).to.equal(owner2.address)
        });
    });




});



