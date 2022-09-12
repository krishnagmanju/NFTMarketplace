
import { ethers } from "hardhat";


  async function deployNftMarketplace() {
    
    const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
    const nftMarketplace = await NftMarketplace.deploy(10,);

    await nftMarketplace.deployed();
    console.log('NftMarketplace deployed', nftMarketplace.address);
  }

  async function deployerc20(){
    const NftToken = await ethers.getContractFactory("NftToken");
    const nftToken = await NftToken.deploy();

    await nftToken.deployed();
    console.log('ERC20 deployed',nftToken.address);
 }
    
async function main() {
  await deployNftMarketplace()
  await deployerc20()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
