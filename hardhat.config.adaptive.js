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
    // Adaptive Learning Network (Docker)
    adaptive: {
      url: process.env.ADAPTIVE_NODE_URL || "http://localhost:8545",
      accounts: process.env.ADAPTIVE_PRIVATE_KEY ? [process.env.ADAPTIVE_PRIVATE_KEY] : [],
      chainId: 1337,
      gasPrice: "auto",
      gas: "auto",
      timeout: 60000,
    },
    // Adaptive Learning Network (Local)
    adaptiveLocal: {
      url: "http://127.0.0.1:8545",
      accounts: process.env.LOCAL_PRIVATE_KEY ? [process.env.LOCAL_PRIVATE_KEY] : [],
      chainId: 1337,
      gasPrice: "auto",
      gas: "auto",
    },
    // Adaptive Learning Network (Testnet)
    adaptiveTestnet: {
      url: process.env.ADAPTIVE_TESTNET_URL || "https://sepolia.infura.io/v3/YOUR-PROJECT-ID",
      accounts: process.env.ADAPTIVE_TESTNET_PRIVATE_KEY ? [process.env.ADAPTIVE_TESTNET_PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: "auto",
      gas: "auto",
    },
    // Hardhat Network with Adaptive Learning
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 1000, // 1 second block time for faster learning
      },
      accounts: {
        count: 20, // More accounts for testing
        accountsBalance: "10000000000000000000000", // 10,000 ETH
      },
      forking: {
        enabled: false,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 60000, // 60 seconds for adaptive learning tests
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  // Adaptive Learning Configuration
  adaptive: {
    enabled: true,
    algorithmLearningRate: process.env.ALGORITHM_LEARNING_RATE || 500,
    securityLearningRate: process.env.SECURITY_LEARNING_RATE || 500,
    consensusLearningRate: process.env.CONSENSUS_LEARNING_RATE || 300,
    blockLearningWindow: process.env.BLOCK_LEARNING_WINDOW || 100,
    minimumBlockConfidence: process.env.MINIMUM_BLOCK_CONFIDENCE || 800,
    quantumSecurityLevel: process.env.QUANTUM_SECURITY_LEVEL || 256,
    maxDifficulty: process.env.MAX_DIFFICULTY || 50,
    baseReward: process.env.BASE_REWARD || 100,
  },
}; 