import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-deploy';
import '@nomiclabs/hardhat-etherscan';

import '@typechain/hardhat';


import * as dotenv from 'dotenv';
dotenv.config();

const RINKEBY_RPC_URL =process.env.RINKEBY_RPC_URL 
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY: ''
const PRIVATE_KEY= process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY: ''

const config: HardhatUserConfig = {
  solidity:"0.8.10",
  networks: {
    hardhat: {
      // // If you want to do some forking, uncomment this
      // forking: {
      //   url: MAINNET_RPC_URL
      // }
      chainId: 31337,
  },
    rinkeby:{
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
  },
  
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },

  namedAccounts: {
    deployer: 0,
  },
};
export default config;

