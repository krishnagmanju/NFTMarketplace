
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {  NftMarketplace} from "../typechain-types";

describe("nftMarketplace", function () {
    let contract: NftMarketplace;
    let owner1:SignerWithAddress;
    let owner2:SignerWithAddress;
    
    //contract deployment
    beforeEach(async () => {
        [owner1,owner2]=await ethers.getSigners();
        
        const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
        contract = await NftMarketplace.deploy(10);
    });

    describe("createNFT", async ()=> {
         it("creating NFT",async()=>{
            await contract.deployed();


        const createNFT=await contract.connect(owner1).createNFT(4,false);
        await createNFT.wait();
        expect(await contract.ownerOfNFT(4)).to.equal(owner1.address)
        });

        


        


    });




});



