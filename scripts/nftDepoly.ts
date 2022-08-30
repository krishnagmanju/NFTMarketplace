
import { ethers } from "hardhat";

async function main() {
    const NftMarketplace = await ethers.getContractFactory("nftMarketplace");
    const nftMarketplace = await NftMarketplace.deploy(10);

    await nftMarketplace.deployed();
    console.log('deployed', nftMarketplace.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
