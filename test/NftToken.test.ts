import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NftMarketplace,NftToken } from "../typechain-types";

describe("NftToken", function () {
    let nftMarketplace: NftMarketplace;
    let nfttoken:NftToken;
    let admin: SignerWithAddress;
    let owner1: SignerWithAddress;
    let owner2:SignerWithAddress;

    //nfttoken deployment
    before(async () => {
        [admin,owner1,owner2] = await ethers.getSigners();
        const NftToken = await ethers.getContractFactory("NftToken");
        nfttoken=await NftToken.deploy();

        const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
        nftMarketplace = await NftMarketplace.connect(admin).deploy(10,nfttoken.address);




    });

    describe("mint", async () => {
        it("mintingToken from admin account", async () => {
            await nfttoken.deployed();
            const mintToken = await nfttoken.connect(admin).mint(admin.address,500);
            await mintToken.wait();
            
            expect(await nfttoken.totalSupply()).to.equal(500)
        });

        it("checking only admin can mint",async () => {
            await nfttoken.deployed();
            // const mintToken = await nfttoken.connect(owner1).mint(owner1.address,100);
            // await mintToken.wait();
            //await nfttoken.connect(owner1).mint(owner1.address,100)
            await expect(nfttoken.connect(owner1).mint(owner1.address,100)).to.be.revertedWith('is not admin');

        });

    });

    describe("burn", async () => {
        it("burnToken from admin account", async () => {
            await nfttoken.deployed();
            const burnToken = await nfttoken.connect(admin).burn(admin.address,5);
            await burnToken.wait();
            
            expect(await nfttoken.totalSupply()).to.equal(495)
        });

        it("checking only admin can burn",async () => {
            await nfttoken.deployed();
            await expect(nfttoken.connect(owner1).burn(owner1.address,100)).to.be.revertedWith('is not admin');
            

        });

    }); 

    describe("transfer", async () => {
        it("transfer without approval", async () => {
            await nfttoken.deployed();

            const mintToken = await nfttoken.connect(admin).mint(owner1.address,500);
            await mintToken.wait();
            
            let beforeTransferOwner1 = Number(await nfttoken.balanceOf(owner1.address));
            let beforeTransferOwner2= Number(await nfttoken.balanceOf(owner2.address));
            const transfer = await nfttoken.connect(admin).transferToken(owner1.address,owner2.address,100);
            await transfer.wait();

            let afterTransferOwner1=Number(await nfttoken.balanceOf(owner1.address));
            let afterTransferOwner2=Number(await nfttoken.balanceOf(owner2.address));

            
            expect(beforeTransferOwner1-afterTransferOwner1).to.equal(afterTransferOwner2-beforeTransferOwner2)
           
        });

    });    

})

