require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local blockchain for testing
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0x82ca44f284c3a6026a49fe56eae093d9b5fb58d7af3e207498ceb8e81584abae",
        "0x106155f9d37d32cb257f63d549a1d84473ff7fe9fcd4ef2fc1ab2bfdfb5d386e"
      ],
      chainId: 1337,
    },
    // Hardhat Network
    hardhat: {
      chainId: 1337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 60000,
  },
}; 