
import { ethers } from "hardhat";

// async function deployerc20(){
//   const NftToken = await ethers.getContractFactory("NftToken");
//   const nftToken = await NftToken.deploy();
//   await nftToken.deployed();
//   console.log('ERC20 deployed',nftToken.address);
// }
  async function deployNftMarketplace() {

  const NftToken = await ethers.getContractFactory("NftToken");
  const nftToken = await NftToken.deploy();
  await nftToken.deployed();  
  console.log('ERC20 deployed',nftToken.address);

  const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
  const nftMarketplace = await NftMarketplace.deploy(10,nftToken.address);

  await nftMarketplace.deployed();
  console.log('NftMarketplace deployed', nftMarketplace.address);
  }

async function main() {
await deployNftMarketplace()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
