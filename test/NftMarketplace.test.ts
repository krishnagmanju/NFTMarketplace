
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NftMarketplace,NftToken } from "../typechain-types";



describe("nftMarketplace", function () {
    let nftMarketplace: NftMarketplace;
    let nftToken:NftToken;
    

    let owner1: SignerWithAddress;
    let owner2: SignerWithAddress;
    let admin: SignerWithAddress;


    //contract deployment
    beforeEach(async () => {
        [owner1, owner2,admin] = await ethers.getSigners();
        const NftToken = await ethers.getContractFactory("NftToken");
        nftToken=await NftToken.deploy();

        const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
        nftMarketplace = await NftMarketplace.connect(admin).deploy(10,nftToken.address);
        
        
    });

    describe("createNFT", async () => {
        it("creating NFT", async () => {
            await nftMarketplace.deployed();
            const createNFT = await nftMarketplace.connect(owner1).createNFT(4, false);
            await createNFT.wait();
            expect(await nftMarketplace.ownerOfNFT(4)).to.equal(owner1.address)
        });

    });

    describe("putForSale", async () => {
        it("For sale", async () => {
            await nftMarketplace.deployed();
            const createNFT = await nftMarketplace.connect(owner1).createNFT(4, false);
            await createNFT.wait();
            expect(await nftMarketplace.ownerOfNFT(4)).to.equal(owner1.address)

            const putForSale = await nftMarketplace.connect(owner1).putForSale(4);
            await putForSale.wait();
            const nftdetails = await nftMarketplace.Nfts(4)
            expect(nftdetails.isForSelling).to.equal(true)
        });

    });

    describe("buyNFT", async () => {
        it("buying NFT", async () => {
            await nftMarketplace.deployed();
            const createNFT = await nftMarketplace.connect(owner1).createNFT(4, false);
            await createNFT.wait();
            expect(await nftMarketplace.ownerOfNFT(4)).to.equal(owner1.address)

            const putForSale = await nftMarketplace.connect(owner1).putForSale(4);
            await putForSale.wait();
            const nftdetails = await nftMarketplace.Nfts(4)
            expect(nftdetails.isForSelling).to.equal(true)

            const buyNFT = await nftMarketplace.connect(owner2).buyNFT(4,"Ether",10,{value:10});
            await buyNFT.wait();
            expect(await nftMarketplace.ownerOfNFT(4)).to.equal(owner2.address);

        const filter = nftMarketplace.filters.payout(null, null)
        const events = await nftMarketplace.queryFilter(filter, 'latest')
        let ethertransactiondetails:any =[];
        events.forEach((item) => {
            
            ethertransactiondetails.push({recipient:item.args.recipient,amount:item.args.amount});
        });
        console.log(ethertransactiondetails)
        const admintransferether=ethertransactiondetails.find((obj:any)=>{
            return obj.recipient===admin.address;
        })
        expect(admintransferether.amount).to.equal(1);

        const ownertransferether=ethertransactiondetails.find((obj:any)=>{
            return obj.recipient===owner1.address;
        })
        expect(ownertransferether.amount).to.equal(9);

        const filter1 = nftToken.filters.Transfer(null, null)
        const events1 = await nftMarketplace.queryFilter(filter, 'latest')
        let tokentransactiondetails:any =[];
        events.forEach((item) => {
            
            tokentransactiondetails.push({recipient:item.args.recipient,amount:item.args.amount});
        });
        console.log(tokentransactiondetails)
        const admintransfertoken=tokentransactiondetails.find((obj:any)=>{
            return obj.recipient===admin.address;
        })
        expect(admintransfertoken.amount).to.equal(1);

        const ownertransfertoken=tokentransactiondetails.find((obj:any)=>{
            return obj.recipient===owner1.address;
        })
        expect(ownertransfertoken.amount).to.equal(9);    
        });
    });
});



