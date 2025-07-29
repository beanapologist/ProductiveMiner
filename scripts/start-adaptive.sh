#!/bin/sh
echo "🧠 Starting ProductiveMiner Adaptive Learning System..."
echo "🔧 Environment: $NODE_ENV"
echo "🧠 Adaptive Learning: $ADAPTIVE_LEARNING_ENABLED"
echo "📊 Algorithm Learning Rate: $ALGORITHM_LEARNING_RATE"
echo "🛡️ Security Learning Rate: $SECURITY_LEARNING_RATE"
echo "⚡ Consensus Learning Rate: $CONSENSUS_LEARNING_RATE"
echo "📈 Block Learning Window: $BLOCK_LEARNING_WINDOW"
echo "🎯 Minimum Block Confidence: $MINIMUM_BLOCK_CONFIDENCE"
echo "🔐 Quantum Security Level: $QUANTUM_SECURITY_LEVEL"
echo "🎯 Max Difficulty: $MAX_DIFFICULTY"
echo "💰 Base Reward: $BASE_REWARD"

# Wait for blockchain node
echo "⏳ Waiting for blockchain node..."
until curl -s http://adaptive-node:8545 > /dev/null; do
  echo "Waiting for blockchain node..."
  sleep 5
done
echo "✅ Blockchain node is ready"

# Deploy adaptive contract if not already deployed
if [ ! -f "/app/deployment-adaptive.json" ]; then
  echo "🚀 Deploying adaptive contract..."
  npx hardhat run scripts/deploy-adaptive.js --network adaptive
else
  echo "✅ Contract already deployed"
fi

# Run adaptive learning tests
echo "🧪 Running adaptive learning tests..."
npx hardhat test test/adaptive-learning.test.js

# Start the application
echo "🚀 Starting adaptive learning application..."
npm start 