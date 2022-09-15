
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NftMarketplace, NftToken } from "../typechain-types";

describe("nftMarketplace", function () {
    let nftMarketplace: NftMarketplace;
    let nftToken: NftToken;

    let owner1: SignerWithAddress;
    let owner2: SignerWithAddress;
    let admin: SignerWithAddress;

    //contract deployment
    beforeEach(async () => {
        [owner1, owner2, admin] = await ethers.getSigners();
        
        const NftToken = await ethers.getContractFactory("NftToken");
        nftToken = await NftToken.connect(admin).deploy();

        const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
        nftMarketplace = await NftMarketplace.connect(admin).deploy(10, nftToken.address);

        const setaddress=await nftToken.connect(admin).setaddress(nftMarketplace.address);
        await setaddress.wait();
        
    });

    describe("createNFT", async () => {
        it("creating NFT", async () => {
            await nftMarketplace.deployed();
            const createNFT = await nftMarketplace.connect(owner1).createNFT(4, false, 10);
            await createNFT.wait();
            expect(await nftMarketplace.ownerOfNFT(4)).to.equal(owner1.address)
        });
    });

    describe("putForSale", async () => {
        it("For sale", async () => {
            await nftMarketplace.deployed();
            const createNFT = await nftMarketplace.connect(owner1).createNFT(4, false, 10);
            await createNFT.wait();
            expect(await nftMarketplace.ownerOfNFT(4)).to.equal(owner1.address)

            const putForSale = await nftMarketplace.connect(owner1).putForSale(4, 10);
            await putForSale.wait();
            const nftdetails = await nftMarketplace.Nfts(4);
            expect(nftdetails.isForSelling).to.equal(true)
        });

    });


    describe("buyNFT", async () => {

        it("buying NFT", async () => {
            await nftMarketplace.deployed();
            const createNFT = await nftMarketplace.connect(owner1).createNFT(4, false, 10);
            await createNFT.wait();
            expect(await nftMarketplace.ownerOfNFT(4)).to.equal(owner1.address)

            const putForSale = await nftMarketplace.connect(owner1).putForSale(4, 10);
            await putForSale.wait();
            const nftdetails = await nftMarketplace.Nfts(4)
            expect(nftdetails.isForSelling).to.equal(true)

            const buyNFT = await nftMarketplace.connect(owner2).buyNFT(4, "Ether", { value: 10 });
            await buyNFT.wait();
            expect(await nftMarketplace.ownerOfNFT(4)).to.equal(owner2.address);



            const filter = nftMarketplace.filters.payout(null, null)
            const events = await nftMarketplace.queryFilter(filter, 'latest')
            let ethertransactiondetails: any = [];
            events.forEach((item) => {

                ethertransactiondetails.push({ recipient: item.args.recipient, amount: item.args.amount });
            });
            console.log(ethertransactiondetails)
            const admintransferether = ethertransactiondetails.find((obj: any) => {
                return obj.recipient === admin.address;
            })
            expect(admintransferether.amount).to.equal(1);

            const ownertransferether = ethertransactiondetails.find((obj: any) => {
                return obj.recipient === owner1.address;
            })
            expect(ownertransferether.amount).to.equal(9);

        });

        it("transfer NFT", async () => {
            await nftMarketplace.deployed();

            await nftToken.deployed();
            const mintToken = await nftToken.connect(admin).mint(owner2.address, 50);
            await mintToken.wait();

            expect(await nftToken.totalSupply()).to.equal(50);

            const createNFT = await nftMarketplace.connect(owner1).createNFT(4, false, 10);
            await createNFT.wait();
            expect(await nftMarketplace.ownerOfNFT(4)).to.equal(owner1.address)

            const putForSale = await nftMarketplace.connect(owner1).putForSale(4, 10);
            await putForSale.wait();
            const nftdetails = await nftMarketplace.Nfts(4)
            expect(nftdetails.isForSelling).to.equal(true)

            const buyNFT = await nftMarketplace.connect(owner2).buyNFT(4, "Token");
            await buyNFT.wait();
            expect(await nftMarketplace.ownerOfNFT(4)).to.equal(owner2.address);



            const filter = nftMarketplace.filters.payout(null, null)
            const events = await nftMarketplace.queryFilter(filter, 'latest')
            let tokentransactiondetails: any = [];
            events.forEach((item) => {

                tokentransactiondetails.push({ recipient: item.args.recipient, amount: item.args.amount });
            });
            console.log(tokentransactiondetails)
            const admintransferether = tokentransactiondetails.find((obj: any) => {
                return obj.recipient === admin.address;
            })
            expect(admintransferether.amount).to.equal(1);

            const ownertransferether = tokentransactiondetails.find((obj: any) => {
                return obj.recipient === owner1.address;
            })
            expect(ownertransferether.amount).to.equal(9);

        });


    })


})