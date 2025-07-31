# ProductiveMiner Testnet Guide

## 🌟 Overview

Welcome to the ProductiveMiner Testnet! This is a hybrid Proof of Work (PoW) and Proof of Stake (PoS) blockchain built on Substrate/Polkadot technology.

### 🎯 Key Features
- **Hybrid Consensus**: Combines PoW mining with PoS validation
- **Dual Token System**: $MINED (PoW rewards) + $RETH (PoS rewards)
- **Mathematical Discovery Mining**: Mine by solving complex mathematical problems
- **Quantum Security**: Advanced cryptographic security measures

---

## 🔗 Network Information

### Testnet Details
- **Network Name**: ProductiveMiner Testnet
- **Chain ID**: `productiveminer-testnet`
- **Token Symbol**: MINED
- **Decimals**: 18
- **Block Time**: ~6 seconds

### RPC Endpoints
```
WebSocket RPC: ws://your-aws-instance:9944
HTTP RPC: http://your-aws-instance:9933
P2P Port: 30333
```

### Faucet
```
URL: http://your-aws-instance:3001
Request Tokens: POST /request
Create Account: POST /account
```

---

## 🚀 Getting Started

### 1. Connect to Testnet

#### Using Polkadot.js Apps
1. Open [Polkadot.js Apps](https://polkadot.js.org/apps/)
2. Go to Settings → Developer
3. Add custom network:
   ```
   Network Name: ProductiveMiner Testnet
   RPC URL: ws://your-aws-instance:9944
   Chain ID: productiveminer-testnet
   ```

#### Using Polkadot.js API
```javascript
const { ApiPromise, WsProvider } = require('@polkadot/api');

const provider = new WsProvider('ws://your-aws-instance:9944');
const api = await ApiPromise.create({ provider });

console.log(`Connected to ${api.runtimeChain}`);
```

### 2. Get Test Tokens

#### Via Faucet API
```bash
# Request tokens
curl -X POST http://your-aws-instance:3001/request \
  -H "Content-Type: application/json" \
  -d '{"address": "YOUR_ADDRESS"}'

# Create new account
curl -X POST http://your-aws-instance:3001/account
```

#### Via Web Interface
Visit `http://your-aws-instance:3001` for a web-based faucet interface.

### 3. Check Balance
```javascript
const { data: { free } } = await api.query.system.account('YOUR_ADDRESS');
console.log(`Balance: ${free.toString()} MINED`);
```

---

## ⛏️ Mining (PoW)

### Submit Mathematical Discovery
```javascript
// Submit a discovery
const tx = api.tx.productiveMiner.submitDiscovery(
  'Prime Pattern Discovery', // work type
  100,                      // difficulty
  '0x1234...',             // result
  '0x5678...',             // proof of work
  256                       // quantum security
);

const hash = await tx.signAndSend(account);
console.log(`Discovery submitted: ${hash.toHex()}`);
```

### Start Mining Session
```javascript
// Start mining with stake
const tx = api.tx.productiveMiner.startMiningSession(
  'Riemann Zero Computation', // work type
  200,                        // difficulty
  '100000000000000000000'    // stake amount (100 MINED)
);

const hash = await tx.signAndSend(account);
```

### Complete Mining Session
```javascript
// Complete mining session
const tx = api.tx.productiveMiner.completeMiningSession(0); // session index
const hash = await tx.signAndSend(account);
```

---

## 🏦 Staking (PoS)

### Become a Validator
```javascript
// Deposit stake to become validator
const tx = api.tx.productiveMiner.depositStake('100000000000000000000'); // 100 MINED
const hash = await tx.signAndSend(account);
```

### Validate Discoveries
```javascript
// Validate a discovery
const discoveryId = '0x1234...'; // discovery hash
const tx = api.tx.productiveMiner.validateDiscovery(discoveryId);
const hash = await tx.signAndSend(account);
```

### Withdraw Stake
```javascript
// Withdraw stake
const tx = api.tx.productiveMiner.withdrawStake('50000000000000000000'); // 50 MINED
const hash = await tx.signAndSend(account);
```

---

## 📊 Querying Data

### Get Mining Sessions
```javascript
const sessions = await api.query.productiveMiner.miningSessions(account.address);
console.log('Mining sessions:', sessions.toHuman());
```

### Get Validator Info
```javascript
const stakeInfo = await api.query.productiveMiner.stakes(account.address);
console.log('Stake info:', stakeInfo.toHuman());
```

### Get Rewards
```javascript
const minerRewards = await api.query.productiveMiner.minerRewards(account.address);
const validatorRewards = await api.query.productiveMiner.validatorRewards(account.address);
console.log(`Miner rewards: ${minerRewards.toString()} MINED`);
console.log(`Validator rewards: ${validatorRewards.toString()} RETH`);
```

---

## 🔧 Exchange Integration

### For Exchanges

#### 1. Connect to Testnet
```javascript
// Connect to testnet RPC
const provider = new WsProvider('ws://your-aws-instance:9944');
const api = await ApiPromise.create({ provider });
```

#### 2. Monitor Transactions
```javascript
// Subscribe to new blocks
await api.rpc.chain.subscribeNewHeads((header) => {
  console.log(`New block: ${header.number}`);
});

// Subscribe to events
await api.query.system.events((events) => {
  events.forEach(({ event }) => {
    if (event.section === 'productiveMiner') {
      console.log('Mining event:', event.toHuman());
    }
  });
});
```

#### 3. Process Deposits/Withdrawals
```javascript
// Check balance
const balance = await api.query.system.account(address);

// Send transaction
const transfer = api.tx.balances.transfer(toAddress, amount);
const hash = await transfer.signAndSend(account);
```

#### 4. Test Scenarios
- **High Volume**: Send multiple transactions simultaneously
- **Large Amounts**: Test with maximum token amounts
- **Network Stress**: Monitor during peak usage
- **Error Handling**: Test invalid transactions

---

## 🛠️ Development Tools

### Polkadot.js Apps
- **URL**: https://polkadot.js.org/apps/
- **Features**: Block explorer, transaction submission, account management

### Polkadot.js API
```bash
npm install @polkadot/api @polkadot/keyring
```

### Substrate Frontend Template
```bash
git clone https://github.com/substrate-developer-hub/substrate-front-end-template
cd substrate-front-end-template
npm install
```

---

## 📈 Monitoring

### Node Health
```bash
# Check node status
curl http://your-aws-instance:9615/metrics

# Check RPC health
curl http://your-aws-instance:9933/health
```

### Network Statistics
```javascript
// Get network info
const chain = await api.rpc.system.chain();
const version = await api.rpc.system.version();
const peers = await api.rpc.system.peers();

console.log(`Chain: ${chain}`);
console.log(`Version: ${version}`);
console.log(`Peers: ${peers.length}`);
```

---

## 🚨 Troubleshooting

### Common Issues

#### Connection Failed
- Check if node is running: `docker ps`
- Verify RPC port is exposed: `netstat -tlnp | grep 9944`
- Check firewall settings

#### Transaction Failed
- Ensure sufficient balance
- Check transaction format
- Verify account has proper permissions

#### Faucet Not Working
- Check faucet server: `curl http://your-aws-instance:3001/health`
- Verify faucet has sufficient balance
- Check server logs

### Support
- **Discord**: [Your Discord Server]
- **Telegram**: [Your Telegram Group]
- **Email**: support@productiveminer.com
- **GitHub**: [Your Repository Issues]

---

## 🔄 Next Steps

1. **Test Integration**: Use the provided endpoints to test your integration
2. **Monitor Performance**: Track transaction throughput and latency
3. **Report Issues**: Contact us with any problems or questions
4. **Prepare for Mainnet**: Once testing is complete, we'll provide mainnet endpoints

---

## 📞 Contact

For technical support or questions about the testnet:
- **Email**: tech@productiveminer.com
- **Discord**: [Your Discord]
- **Telegram**: [Your Telegram]
- **X**: @ProductiveMiner

Happy testing! 🚀 