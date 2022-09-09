import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NftToken } from "../typechain-types";

describe("NftToken", function () {
    let contract:NftToken ;
    let admin: SignerWithAddress;
    let owner1: SignerWithAddress;
    let owner2:SignerWithAddress;

    //contract deployment
    before(async () => {
        [admin,owner1,owner2] = await ethers.getSigners();

        const NftToken = await ethers.getContractFactory("NftToken");
        contract = await NftToken.deploy();
    });

    describe("mint", async () => {
        it("mintingToken from admin account", async () => {
            await contract.deployed();
            const mintToken = await contract.connect(admin).mint(admin.address,500);
            await mintToken.wait();
            
            expect(await contract.totalSupply()).to.equal(500)
        });

        it("checking only admin can mint",async () => {
            await contract.deployed();
            const mintToken = await contract.connect(owner1).mint(owner1.address,500);
            await mintToken.wait();
            
            expect(await contract.totalSupply()).to.equal(500)
            
        });

    });

    describe("burn", async () => {
        it("burnToken from admin account", async () => {
            await contract.deployed();
            const burnToken = await contract.connect(admin).burn(admin.address,5);
            await burnToken.wait();
            
            expect(await contract.totalSupply()).to.equal(495)
        });

        it("checking only admin can burn",async () => {
            await contract.deployed();
            const burnToken = await contract.connect(owner1).burn(owner1.address,495);
            await burnToken.wait();
            
            expect(await contract.totalSupply()).to.equal(0)
            
        });

    }); 

    describe("transfer", async () => {
        it("transfer without approval", async () => {
            await contract.deployed();


            
            const mintToken = await contract.connect(admin).mint(owner1.address,500);
            await mintToken.wait();
            

            let beforeTransferOwner1 = Number(await contract.balanceOf(owner1.address));
            let beforeTransferOwner2= Number(await contract.balanceOf(owner2.address));
            const transfer = await contract.connect(admin).transferToken(owner1.address,owner2.address,100);
            await transfer.wait();

            let afterTransferOwner1=Number(await contract.balanceOf(owner1.address));
            let afterTransferOwner2=Number(await contract.balanceOf(owner2.address));

            
            expect(beforeTransferOwner1-afterTransferOwner1).to.equal(afterTransferOwner2-beforeTransferOwner2)
           
        });

    });    
})

