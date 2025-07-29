#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Sepolia Testnet Environment...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

function createEnvFile() {
  console.log('📝 Creating .env file for testnet deployment...');
  
  const envContent = `# ProductiveMiner Sepolia Testnet Environment Configuration
# ======================================================

# Database Configuration
DATABASE_URL=postgresql://productiveminer:CHANGE_THIS_PASSWORD@localhost:5432/productiveminer_testnet
PGHOST=localhost
PGPORT=5432
PGUSER=productiveminer
PGPASSWORD=CHANGE_THIS_PASSWORD
PGDATABASE=productiveminer_testnet

# Server Configuration
NODE_ENV=testnet
PORT=5000
HOST=0.0.0.0

# Testnet Specific Configuration
TESTNET_MODE=true
MAX_CONCURRENT_SESSIONS=50
DEFAULT_DIFFICULTY=25
BLOCK_TIME_SECONDS=30
MAX_MINING_SESSIONS_PER_IP=10

# Security Configuration (CHANGE THESE!)
JWT_SECRET=testnet_jwt_secret_please_change_this_in_production
ENCRYPTION_KEY=testnet_32_byte_encryption_key_change_this

# Redis Configuration (if using Redis)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Monitoring & Logging
LOG_LEVEL=info
ENABLE_DEBUG_LOGS=true
METRICS_ENABLED=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MINING_RATE_LIMIT_MAX=10

# Mathematical Engine Configuration
ENABLE_ALL_WORK_TYPES=true
PRIME_COMPUTATION_TIMEOUT=300000
RIEMANN_COMPUTATION_TIMEOUT=600000
QUANTUM_SECURITY_LEVEL=256

# Blockchain Configuration
GENESIS_BLOCK_REWARD=1000
DIFFICULTY_ADJUSTMENT_INTERVAL=144
TARGET_BLOCK_TIME=30

# API Configuration
API_RATE_LIMIT=100
API_TIMEOUT=30000
MAX_REQUEST_SIZE=10mb

# WebSocket Configuration
WS_HEARTBEAT_INTERVAL=30000
WS_MAX_CONNECTIONS=1000

# Development/Debug Features (Testnet Only)
ENABLE_DETAILED_LOGGING=true
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_SQL_QUERY_LOGGING=false
SKIP_AUTHENTICATION=false

# ======================================================
# SEPOLIA TESTNET CONFIGURATION
# ======================================================

# Sepolia Network Configuration
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
SEPOLIA_PRIVATE_KEY=your_private_key_here
SEPOLIA_CHAIN_ID=11155111

# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Gas Configuration
GAS_LIMIT=3000000
GAS_PRICE_AUTO=true
MAX_GAS_PRICE=100000000000  # 100 gwei

# Contract Configuration
CONTRACT_NAME=ProductiveMiner
CONTRACT_VERSION=1.0.0

# Deployment Configuration
DEPLOYMENT_TIMEOUT=300000  # 5 minutes
CONFIRMATION_BLOCKS=5
VERIFICATION_DELAY=30000   # 30 seconds

# Testnet Funding
TESTNET_BUDGET_ETH=0.08
MAX_GAS_PER_TX=5000000

# Monitoring Configuration
ENABLE_GAS_MONITORING=true
GAS_PRICE_ALERT_THRESHOLD=50  # gwei
LOW_BALANCE_ALERT=0.01  # ETH

# ======================================================
# BACKUP NETWORKS (if Sepolia has issues)
# ======================================================

# Goerli Network (backup)
GOERLI_URL=https://goerli.infura.io/v3/YOUR-PROJECT-ID
GOERLI_PRIVATE_KEY=your_goerli_private_key_here
GOERLI_CHAIN_ID=5

# ======================================================
# ENVIRONMENT-SPECIFIC OVERRIDES
# ======================================================

# Override for testnet deployment
ENABLE_TESTNET_FEATURES=true
SKIP_MAINNET_VALIDATIONS=true
ALLOW_TESTNET_ONLY_FUNCTIONS=true

# Performance tuning for testnet
OPTIMIZE_FOR_TESTNET=true
REDUCE_GAS_USAGE=true
ENABLE_GAS_OPTIMIZATION=true
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    return false;
  }
}

function checkRequirements() {
  console.log('🔍 Checking testnet requirements...\n');
  
  const requirements = [
    {
      name: 'Node.js Version',
      check: () => {
        const version = process.version;
        const major = parseInt(version.slice(1).split('.')[0]);
        return { passed: major >= 16, value: version };
      }
    },
    {
      name: 'Hardhat Installation',
      check: () => {
        try {
          require('hardhat');
          return { passed: true, value: 'Installed' };
        } catch (error) {
          return { passed: false, value: 'Not installed' };
        }
      }
    },
    {
      name: 'Ethers.js',
      check: () => {
        try {
          require('ethers');
          return { passed: true, value: 'Installed' };
        } catch (error) {
          return { passed: false, value: 'Not installed' };
        }
      }
    },
    {
      name: 'Contract Compilation',
      check: () => {
        try {
          const { execSync } = require('child_process');
          execSync('npx hardhat compile --quiet', { stdio: 'pipe' });
          return { passed: true, value: 'Compiled successfully' };
        } catch (error) {
          return { passed: false, value: 'Compilation failed' };
        }
      }
    }
  ];

  let allPassed = true;
  
  for (const req of requirements) {
    const result = req.check();
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${req.name}: ${result.value}`);
    if (!result.passed) allPassed = false;
  }
  
  return allPassed;
}

function displayNextSteps() {
  console.log('\n🎯 Next Steps for Testnet Deployment:');
  console.log('=====================================');
  console.log('');
  console.log('1. 🔑 Configure Environment Variables:');
  console.log('   - Edit .env file');
  console.log('   - Set SEPOLIA_URL (Infura/Alchemy)');
  console.log('   - Set SEPOLIA_PRIVATE_KEY');
  console.log('   - Set ETHERSCAN_API_KEY');
  console.log('');
  console.log('2. 💰 Get Testnet ETH:');
  console.log('   - Visit: https://sepoliafaucet.com/');
  console.log('   - Or: https://faucet.sepolia.dev/');
  console.log('   - Recommended: 0.08 ETH for testing');
  console.log('');
  console.log('3. 🚀 Deploy Contract:');
  console.log('   - Run: npx hardhat run scripts/deploy.js --network sepolia');
  console.log('   - Verify: npx hardhat verify --network sepolia <ADDRESS>');
  console.log('');
  console.log('4. 🧪 Test Deployment:');
  console.log('   - Run: npx hardhat test --network sepolia');
  console.log('   - Monitor gas costs and performance');
  console.log('');
  console.log('5. 📊 Monitor Performance:');
  console.log('   - Check gas prices: npx hardhat console --network sepolia');
  console.log('   - Monitor transactions on Etherscan');
  console.log('');
}

function displayConfigurationGuide() {
  console.log('\n📋 Configuration Guide:');
  console.log('=======================');
  console.log('');
  console.log('🔧 Required Environment Variables:');
  console.log('');
  console.log('SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID');
  console.log('SEPOLIA_PRIVATE_KEY=0x...your_private_key_here...');
  console.log('ETHERSCAN_API_KEY=your_etherscan_api_key');
  console.log('');
  console.log('🔗 Get API Keys:');
  console.log('- Infura: https://infura.io/');
  console.log('- Alchemy: https://alchemy.com/');
  console.log('- Etherscan: https://etherscan.io/apis');
  console.log('');
  console.log('💰 Get Sepolia ETH:');
  console.log('- https://sepoliafaucet.com/');
  console.log('- https://faucet.sepolia.dev/');
  console.log('');
}

async function main() {
  console.log('🚀 ProductiveMiner Sepolia Testnet Setup');
  console.log('=========================================\n');
  
  // Check requirements
  const requirementsMet = checkRequirements();
  
  if (!requirementsMet) {
    console.log('\n❌ Some requirements are not met. Please fix them before proceeding.');
    return;
  }
  
  console.log('\n✅ All requirements met!\n');
  
  // Create .env file if it doesn't exist
  if (!fs.existsSync(envPath)) {
    const created = createEnvFile();
    if (!created) {
      console.log('\n❌ Failed to create .env file. Please create it manually.');
      return;
    }
  } else {
    console.log('✅ .env file already exists');
  }
  
  // Display configuration guide
  displayConfigurationGuide();
  
  // Display next steps
  displayNextSteps();
  
  console.log('\n🎉 Testnet environment setup complete!');
  console.log('Ready for deployment to Sepolia testnet.');
}

main().catch(console.error); 