// Contract configuration for ProductiveMiner dApp
// Update these addresses when deploying to different networks

const CONTRACTS = {
  // Local development (localhost:8545)
  localhost: {
    MINED_TOKEN: '0x29Da977Cd0b3C5326fc02EcC8D0C7efC294290E2',
    SOLIDARITY_CONTRACT: '0x05D277F6FB68EB0460f4488608C747EaEdDC7429',
    NETWORK_ID: '0x539', // 1337 in hex
    NETWORK_NAME: 'ProductiveMiner TestNet'
  },
  
  // Testnet (when deployed)
  testnet: {
    MINED_TOKEN: '0x29Da977Cd0b3C5326fc02EcC8D0C7efC294290E2',
    SOLIDARITY_CONTRACT: '0x05D277F6FB68EB0460f4488608C747EaEdDC7429',
    NETWORK_ID: '0x539', // 1337 in hex
    NETWORK_NAME: 'ProductiveMiner TestNet'
  },
  
  // Mainnet (when deployed)
  mainnet: {
    MINED_TOKEN: '', // To be filled when deployed to mainnet
    SOLIDARITY_CONTRACT: '', // To be filled when deployed to mainnet
    NETWORK_ID: '0x1', // 1 in hex
    NETWORK_NAME: 'Ethereum Mainnet'
  }
};

// Get contract addresses based on current network
export const getContractAddresses = (networkId = '0x539') => {
  switch (networkId) {
    case '0x1':
      return CONTRACTS.mainnet;
    case '0x539':
    default:
      return CONTRACTS.localhost;
  }
};

// Get specific contract address
export const getContractAddress = (contractName, networkId = '0x539') => {
  const addresses = getContractAddresses(networkId);
  return addresses[contractName];
};

// Export individual contract addresses for convenience
export const MINED_TOKEN_ADDRESS = CONTRACTS.localhost.MINED_TOKEN;
export const SOLIDARITY_CONTRACT_ADDRESS = CONTRACTS.localhost.SOLIDARITY_CONTRACT;

export default CONTRACTS; 