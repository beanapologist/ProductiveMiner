# Hardhat Troubleshooting Guide

## 🔧 Common Issues & Solutions

### 1. Port Already in Use (EADDRINUSE)

**Problem**: `Error: listen EADDRINUSE: address already in use 127.0.0.1:8545`

**Solutions**:

#### Option A: Use the Node Manager Script
```bash
# Check if node is running
node scripts/manage-node.js status

# Stop existing node
node scripts/manage-node.js stop

# Start new node
node scripts/manage-node.js start

# Or use a different port
node scripts/manage-node.js start 8546
```

#### Option B: Manual Process Management
```bash
# Find process using port 8545
lsof -ti:8545

# Kill the process (replace PID with actual process ID)
kill <PID>

# Or force kill if needed
kill -9 <PID>
```

#### Option C: Use Different Port
```bash
# Start Hardhat node on different port
npx hardhat node --port 8546

# Update your hardhat.config.js to use the new port
networks: {
  localhost: {
    url: "http://127.0.0.1:8546"
  }
}
```

### 2. Node.js Version Warning

**Problem**: `WARNING: You are currently using Node.js v23.11.0, which is not supported by Hardhat`

**Solutions**:

#### Option A: Use Node Version Manager (Recommended)
```bash
# Install nvm if you haven't already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use supported Node.js version
nvm install 18
nvm use 18

# Verify version
node --version
```

#### Option B: Use Docker
```bash
# Run Hardhat in Docker with supported Node.js version
docker run -it --rm -v $(pwd):/app -w /app node:18 npx hardhat test
```

### 3. Compilation Issues

**Problem**: Solidity compilation errors

**Solutions**:
```bash
# Clean and recompile
npx hardhat clean
npx hardhat compile

# Force recompilation
npx hardhat compile --force

# Check Solidity version compatibility
npx hardhat compile --verbose
```

### 4. Test Failures

**Problem**: Tests failing unexpectedly

**Solutions**:
```bash
# Run tests with verbose output
npx hardhat test --verbose

# Run specific test file
npx hardhat test test/ProductiveMiner.test.js

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run tests with specific pattern
npx hardhat test --grep "Deployment"
```

### 5. Network Connection Issues

**Problem**: Can't connect to Hardhat network

**Solutions**:
```bash
# Check if node is running
node scripts/manage-node.js status

# Restart the node
node scripts/manage-node.js stop
node scripts/manage-node.js start

# Check network configuration
npx hardhat console --network localhost
```

## 🚀 Quick Commands Reference

### Node Management
```bash
# Start node
npx hardhat node
# or
node scripts/manage-node.js start

# Stop node
node scripts/manage-node.js stop

# Check status
node scripts/manage-node.js status

# Start on different port
node scripts/manage-node.js start 8546
```

### Testing
```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test
npx hardhat test --grep "Deployment"

# Run with verbose output
npx hardhat test --verbose
```

### Compilation
```bash
# Compile contracts
npx hardhat compile

# Force recompile
npx hardhat compile --force

# Clean and compile
npx hardhat clean && npx hardhat compile
```

### Deployment
```bash
# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet
npx hardhat run scripts/deploy.js --network goerli

# Verify contract
npx hardhat verify --network goerli <CONTRACT_ADDRESS>
```

## 🔍 Debugging Tips

### 1. Enable Debug Logging
```bash
# Run with debug output
DEBUG=hardhat:* npx hardhat test
```

### 2. Check Network State
```bash
# Connect to Hardhat console
npx hardhat console --network localhost

# Check accounts
const accounts = await ethers.getSigners()
console.log(accounts[0].address)
```

### 3. Gas Optimization
```bash
# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Check gas usage for specific function
npx hardhat test --grep "submitDiscovery"
```

## 📊 Performance Monitoring

### Check Network Performance
```bash
# Run network comparison tests
npx hardhat test test/network-comparison.test.js
```

### Monitor Gas Usage
```bash
# Run with detailed gas reporting
REPORT_GAS=true npx hardhat test --grep "calculateReward"
```

## 🛠️ Development Workflow

### Recommended Development Process
1. **Start Hardhat Node**: `node scripts/manage-node.js start`
2. **Write/Edit Contracts**: Modify `contracts/` files
3. **Compile**: `npx hardhat compile`
4. **Test**: `npx hardhat test`
5. **Deploy**: `npx hardhat run scripts/deploy.js --network localhost`
6. **Verify**: Check contract functionality
7. **Repeat**: Iterate on improvements

### Best Practices
- ✅ Always run tests before deployment
- ✅ Use gas reporting to optimize contracts
- ✅ Test on local network before testnet
- ✅ Use descriptive test names
- ✅ Keep node running during development
- ✅ Use version control for contract changes

## 🆘 Emergency Commands

### Kill All Hardhat Processes
```bash
# Find all Hardhat processes
ps aux | grep hardhat

# Kill all Node.js processes (use carefully)
pkill -f "hardhat"
```

### Reset Hardhat Environment
```bash
# Clean everything
npx hardhat clean
rm -rf cache artifacts

# Reinstall dependencies
npm install

# Restart node
node scripts/manage-node.js stop
node scripts/manage-node.js start
```

## 📞 Getting Help

If you encounter issues not covered here:

1. **Check Hardhat Documentation**: https://hardhat.org/docs
2. **Review Error Messages**: Look for specific error codes
3. **Check Network Status**: Ensure node is running
4. **Verify Configuration**: Check `hardhat.config.js`
5. **Update Dependencies**: `npm update`

## 🎯 Quick Fix Checklist

When encountering issues, try these steps in order:

- [ ] Check if Hardhat node is running: `node scripts/manage-node.js status`
- [ ] Restart node if needed: `node scripts/manage-node.js stop && node scripts/manage-node.js start`
- [ ] Clean and recompile: `npx hardhat clean && npx hardhat compile`
- [ ] Run tests: `npx hardhat test`
- [ ] Check network configuration in `hardhat.config.js`
- [ ] Verify Node.js version compatibility
- [ ] Check for port conflicts: `lsof -ti:8545` 