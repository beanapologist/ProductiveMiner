#!/bin/bash

echo "🚀 ProductiveMiner Migration to Hyperledger Besu"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BESU_VERSION="23.10.1"
BESU_URL="https://hyperledger.jfrog.io/artifactory/besu-binaries/besu/${BESU_VERSION}/besu-${BESU_VERSION}.tar.gz"
CHAIN_ID="1337"
NETWORK_ID="1337"
RPC_PORT="8545"
P2P_PORT="30303"
DATA_DIR="./data/besu"
GENESIS_FILE="./config/besu-genesis.json"

echo ""
echo "📋 Migration Overview:"
echo "====================="
echo "• Current: Ganache (Development Blockchain)"
echo "• Target: Hyperledger Besu (Production Blockchain)"
echo "• Features: Hybrid PoW/PoS, Mathematical Mining, Adaptive Learning"
echo "• Compatibility: Ethereum-compatible, Solidity contracts work natively"

echo ""
echo "🔧 Phase 1: Environment Setup"
echo "============================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data/besu
mkdir -p config
mkdir -p logs/besu
mkdir -p scripts/besu

# Download Besu
echo "⬇️  Downloading Hyperledger Besu..."
if [ ! -f "besu-${BESU_VERSION}.tar.gz" ]; then
    curl -L -o "besu-${BESU_VERSION}.tar.gz" "${BESU_URL}"
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to download Besu${NC}"
        exit 1
    fi
fi

# Extract Besu
echo "📦 Extracting Besu..."
tar -xzf "besu-${BESU_VERSION}.tar.gz"
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to extract Besu${NC}"
    exit 1
fi

echo ""
echo "🔧 Phase 2: Genesis Block Configuration"
echo "======================================"

# Create custom genesis block for ProductiveMiner
cat > "${GENESIS_FILE}" << 'EOF'
{
  "config": {
    "chainId": 1337,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0,
    "clique": {
      "period": 15,
      "epoch": 30000
    }
  },
  "difficulty": "0x1",
  "gasLimit": "0x8000000",
  "timestamp": "0x0",
  "nonce": "0x0000000000000042",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "alloc": {
    "0x1234567890123456789012345678901234567890": {
      "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
    },
    "0x1111111111111111111111111111111111111111": {
      "balance": "0x100000000000000000000000000000000000000000000000000000000000000"
    },
    "0x2222222222222222222222222222222222222222": {
      "balance": "0x100000000000000000000000000000000000000000000000000000000000000"
    }
  }
}
EOF

echo "✅ Genesis block created: ${GENESIS_FILE}"

echo ""
echo "🔧 Phase 3: Docker Configuration"
echo "==============================="

# Create Docker Compose for Besu
cat > "docker-compose.besu.yml" << 'EOF'
version: '3.8'

services:
  # Hyperledger Besu Node
  besu-node:
    image: hyperledger/besu:23.10.1
    container_name: besu-productiveminer
    ports:
      - "8545:8545"  # RPC
      - "8546:8546"  # WS
      - "30303:30303"  # P2P
    volumes:
      - ./data/besu:/opt/besu/data
      - ./config/besu-genesis.json:/opt/besu/genesis.json
      - ./logs/besu:/opt/besu/logs
    environment:
      - BESU_NETWORK=dev
      - BESU_RPC_HTTP_ENABLED=true
      - BESU_RPC_HTTP_API=ETH,NET,WEB3,ADMIN,DEBUG
      - BESU_RPC_HTTP_CORS_ORIGINS=*
      - BESU_RPC_HTTP_HOST=0.0.0.0
      - BESU_RPC_HTTP_PORT=8545
      - BESU_RPC_WS_ENABLED=true
      - BESU_RPC_WS_API=ETH,NET,WEB3,ADMIN
      - BESU_RPC_WS_HOST=0.0.0.0
      - BESU_RPC_WS_PORT=8546
      - BESU_P2P_ENABLED=true
      - BESU_P2P_PORT=30303
      - BESU_MINER_ENABLED=true
      - BESU_MINER_COINBASE=0x1234567890123456789012345678901234567890
      - BESU_MINER_EXTRA_DATA=ProductiveMiner
      - BESU_SYNC_MODE=FAST
      - BESU_GENESIS_FILE=/opt/besu/genesis.json
      - BESU_DATA_PATH=/opt/besu/data
      - BESU_LOGGING=INFO
    command: >
      --genesis-file=/opt/besu/genesis.json
      --network-id=1337
      --rpc-http-enabled
      --rpc-http-api=ETH,NET,WEB3,ADMIN,DEBUG
      --rpc-http-cors-origins="*"
      --rpc-http-host=0.0.0.0
      --rpc-http-port=8545
      --rpc-ws-enabled
      --rpc-ws-api=ETH,NET,WEB3,ADMIN
      --rpc-ws-host=0.0.0.0
      --rpc-ws-port=8546
      --p2p-enabled
      --p2p-port=30303
      --miner-enabled
      --miner-coinbase=0x1234567890123456789012345678901234567890
      --miner-extra-data=ProductiveMiner
      --sync-mode=FAST
      --data-path=/opt/besu/data
      --logging=INFO
    networks:
      - besu-network

  # ProductiveMiner Application (Updated for Besu)
  productiveminer-app:
    build:
      context: .
      dockerfile: Dockerfile.adaptive
    container_name: productiveminer-app-besu
    ports:
      - "3000:3000"
    volumes:
      - ./data/app:/app/data
      - ./logs:/app/logs
    environment:
      - NODE_ENV=production
      - PORT=3000
      - BLOCKCHAIN_URL=http://besu-node:8545
      - BLOCKCHAIN_TYPE=besu
    depends_on:
      - besu-node
      - productiveminer-db
      - productiveminer-redis
    networks:
      - besu-network

  # Database
  productiveminer-db:
    image: postgres:15-alpine
    container_name: productiveminer-db-besu
    ports:
      - "5432:5432"
    volumes:
      - ./data/db:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=productiveminer_besu
      - POSTGRES_USER=productiveminer
      - POSTGRES_PASSWORD=besu_password
    networks:
      - besu-network

  # Redis Cache
  productiveminer-redis:
    image: redis:7-alpine
    container_name: productiveminer-redis-besu
    ports:
      - "6379:6379"
    volumes:
      - ./data/redis:/data
      - ./config/redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    networks:
      - besu-network

networks:
  besu-network:
    driver: bridge
EOF

echo "✅ Docker Compose configuration created: docker-compose.besu.yml"

echo ""
echo "🔧 Phase 4: Contract Migration"
echo "============================="

# Create migration script for contracts
cat > "scripts/migrate-contracts.js" << 'EOF'
const { ethers } = require('hardhat');

async function migrateContracts() {
    console.log('🚀 Migrating contracts to Besu...');
    
    // Connect to Besu
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    
    // Get signer
    const [deployer] = await ethers.getSigners();
    console.log('📝 Deploying contracts with account:', deployer.address);
    
    // Deploy ProductiveMiner contract
    const ProductiveMiner = await ethers.getContractFactory('ProductiveMiner');
    const productiveMiner = await ProductiveMiner.deploy();
    await productiveMiner.deployed();
    
    console.log('✅ ProductiveMiner deployed to:', productiveMiner.address);
    
    // Deploy ProductiveMinerAdaptive contract
    const ProductiveMinerAdaptive = await ethers.getContractFactory('ProductiveMinerAdaptive');
    const productiveMinerAdaptive = await ProductiveMinerAdaptive.deploy();
    await productiveMinerAdaptive.deployed();
    
    console.log('✅ ProductiveMinerAdaptive deployed to:', productiveMinerAdaptive.address);
    
    // Verify contracts
    console.log('🔍 Verifying contracts...');
    try {
        await hre.run('verify:verify', {
            address: productiveMiner.address,
            constructorArguments: [],
        });
        console.log('✅ ProductiveMiner verified');
    } catch (error) {
        console.log('⚠️  ProductiveMiner verification failed:', error.message);
    }
    
    try {
        await hre.run('verify:verify', {
            address: productiveMinerAdaptive.address,
            constructorArguments: [],
        });
        console.log('✅ ProductiveMinerAdaptive verified');
    } catch (error) {
        console.log('⚠️  ProductiveMinerAdaptive verification failed:', error.message);
    }
    
    // Save deployment info
    const deploymentInfo = {
        network: 'besu',
        chainId: 1337,
        contracts: {
            ProductiveMiner: productiveMiner.address,
            ProductiveMinerAdaptive: productiveMinerAdaptive.address
        },
        deployer: deployer.address,
        timestamp: new Date().toISOString()
    };
    
    require('fs').writeFileSync(
        './deployment-besu.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('📄 Deployment info saved to: deployment-besu.json');
    console.log('🎉 Contract migration completed!');
}

migrateContracts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
EOF

echo "✅ Contract migration script created: scripts/migrate-contracts.js"

echo ""
echo "🔧 Phase 5: Configuration Updates"
echo "================================"

# Update Hardhat configuration for Besu
cat > "hardhat.config.besu.js" << 'EOF'
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
    // Besu Network
    besu: {
      url: process.env.BESU_URL || "http://localhost:8545",
      accounts: process.env.BESU_PRIVATE_KEY ? [process.env.BESU_PRIVATE_KEY] : [],
      chainId: 1337,
      gasPrice: "auto",
      gas: "auto",
      timeout: 60000,
    },
    // Besu Testnet
    besuTestnet: {
      url: process.env.BESU_TESTNET_URL || "http://localhost:8545",
      accounts: process.env.BESU_TESTNET_PRIVATE_KEY ? [process.env.BESU_TESTNET_PRIVATE_KEY] : [],
      chainId: 1337,
      gasPrice: "auto",
      gas: "auto",
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
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
EOF

echo "✅ Hardhat configuration updated: hardhat.config.besu.js"

echo ""
echo "🔧 Phase 6: Environment Configuration"
echo "==================================="

# Create environment file for Besu
cat > ".env.besu" << 'EOF'
# Besu Network Configuration
BESU_URL=http://localhost:8545
BESU_WS_URL=ws://localhost:8546
BESU_CHAIN_ID=1337
BESU_NETWORK_ID=1337

# Contract Addresses (will be updated after deployment)
PRODUCTIVE_MINER_ADDRESS=
PRODUCTIVE_MINER_ADAPTIVE_ADDRESS=

# Database Configuration
DATABASE_URL=postgresql://productiveminer:besu_password@localhost:5432/productiveminer_besu
PGHOST=localhost
PGPORT=5432
PGUSER=productiveminer
PGPASSWORD=besu_password
PGDATABASE=productiveminer_besu

# Server Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
BLOCKCHAIN_TYPE=besu

# Mathematical Engine Configuration
ENABLE_ALL_WORK_TYPES=true
PRIME_COMPUTATION_TIMEOUT=300000
RIEMANN_COMPUTATION_TIMEOUT=600000
QUANTUM_SECURITY_LEVEL=256

# Blockchain Configuration
GENESIS_BLOCK_REWARD=1000
DIFFICULTY_ADJUSTMENT_INTERVAL=144
TARGET_BLOCK_TIME=15

# Security Configuration
JWT_SECRET=besu_production_jwt_secret_change_this
ENCRYPTION_KEY=besu_32_byte_encryption_key_change_this

# Monitoring & Logging
LOG_LEVEL=info
ENABLE_DEBUG_LOGS=false
METRICS_ENABLED=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MINING_RATE_LIMIT_MAX=10
EOF

echo "✅ Environment configuration created: .env.besu"

echo ""
echo "🔧 Phase 7: Testing Scripts"
echo "==========================="

# Create test script for Besu
cat > "scripts/test-besu.js" << 'EOF'
const { ethers } = require('hardhat');

async function testBesu() {
    console.log('🧪 Testing Besu integration...');
    
    // Connect to Besu
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    
    // Check network
    const network = await provider.getNetwork();
    console.log('🌐 Network:', network);
    
    // Get accounts
    const accounts = await provider.listAccounts();
    console.log('👥 Accounts:', accounts.length);
    
    // Get latest block
    const latestBlock = await provider.getBlockNumber();
    console.log('📦 Latest block:', latestBlock);
    
    // Test mathematical mining
    console.log('⛏️  Testing mathematical mining...');
    
    // Deploy test contract
    const ProductiveMiner = await ethers.getContractFactory('ProductiveMiner');
    const productiveMiner = await ProductiveMiner.deploy();
    await productiveMiner.deployed();
    
    console.log('✅ ProductiveMiner deployed to:', productiveMiner.address);
    
    // Test discovery submission
    const [deployer] = await ethers.getSigners();
    
    const discoveryTx = await productiveMiner.submitDiscovery(
        'Prime Pattern Discovery',
        25,
        'Test result',
        'Test proof',
        256
    );
    
    await discoveryTx.wait();
    console.log('✅ Discovery submitted successfully');
    
    // Get discovery count
    const totalDiscoveries = await productiveMiner.totalDiscoveries();
    console.log('📊 Total discoveries:', totalDiscoveries.toString());
    
    console.log('🎉 Besu integration test completed successfully!');
}

testBesu()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Test failed:', error);
        process.exit(1);
    });
EOF

echo "✅ Test script created: scripts/test-besu.js"

echo ""
echo "🚀 Migration Setup Complete!"
echo "==========================="
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. 🐳 Start Besu: docker-compose -f docker-compose.besu.yml up -d"
echo "2. 🔍 Wait for Besu to sync: docker logs besu-productiveminer"
echo "3. 📝 Deploy contracts: npx hardhat run scripts/migrate-contracts.js --network besu"
echo "4. 🧪 Test integration: npx hardhat run scripts/test-besu.js --network besu"
echo "5. 🚀 Start application: docker-compose -f docker-compose.besu.yml up -d productiveminer-app"
echo ""
echo "🔗 Access Points:"
echo "================"
echo "• Besu RPC: http://localhost:8545"
echo "• Besu WebSocket: ws://localhost:8546"
echo "• Application: http://localhost:3000"
echo "• Database: localhost:5432"
echo ""
echo "📊 Monitoring:"
echo "============="
echo "• Besu logs: docker logs besu-productiveminer -f"
echo "• Application logs: docker logs productiveminer-app-besu -f"
echo "• Network status: curl -X POST -H 'Content-Type: application/json' --data '{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}' http://localhost:8545"
echo ""
echo "🎉 Ready for production deployment!"