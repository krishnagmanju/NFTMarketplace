import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
const { network } = require("hardhat");
import verify from "../utils/verify";
import {developmentChains} from "../helper-hardhat-config";



const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts,network} = hre;
  const {deploy,log} = deployments;
const { deployer } = await getNamedAccounts();


const nftToken= await deploy('NftToken', {
    from: deployer,
    args: [],
    log: true,
  });

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    const delay = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(60000);
    log("Verifying...")
    await verify(nftToken.address, [])

  }

const nftMarketplace= await deploy('NftMarketplace', {
    from: deployer,
    args: [10,nftToken.address],
    log: true,
    proxy:true,
  });
 // Verify the deployment
 if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  const delay = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(60000);
  log("Verifying...")
  await verify(nftMarketplace.address, [10,nftToken.address])
 
}
  
};
export default func;