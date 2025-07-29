#!/bin/bash

echo "🚀 Starting ProductiveMiner Application..."

# Check if backend is running
if curl -s http://localhost:3000/api/status > /dev/null 2>&1; then
    echo "✅ Backend is already running on port 3000"
else
    echo "🔄 Starting backend..."
    node index.js &
    BACKEND_PID=$!
    echo "✅ Backend started with PID: $BACKEND_PID"
    
    # Wait for backend to start
    echo "⏳ Waiting for backend to start..."
    for i in {1..10}; do
        if curl -s http://localhost:3000/api/status > /dev/null 2>&1; then
            echo "✅ Backend is ready!"
            break
        fi
        sleep 1
    done
fi

# Check if frontend is running
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Frontend is already running on port 3001"
else
    echo "🔄 Starting frontend..."
    cd frontend && npm start &
    FRONTEND_PID=$!
    echo "✅ Frontend started with PID: $FRONTEND_PID"
    
    # Wait for frontend to start
    echo "⏳ Waiting for frontend to start..."
    for i in {1..15}; do
        if curl -s http://localhost:3001 > /dev/null 2>&1; then
            echo "✅ Frontend is ready!"
            break
        fi
        sleep 1
    done
fi

echo ""
echo "🎉 Application is ready!"
echo "📊 Backend: http://localhost:3000"
echo "🎨 Frontend: http://localhost:3001"
echo ""
echo "🧪 Testing endpoints..."

# Test mining endpoint
echo "⛏️  Testing mining endpoint..."
MINING_RESPONSE=$(curl -s -X POST http://localhost:3000/api/mining/mine \
  -H "Content-Type: application/json" \
  -d '{"workType": "Prime Pattern Discovery", "difficulty": 25, "quantumSecurity": 256}')

if echo "$MINING_RESPONSE" | grep -q "success"; then
    echo "✅ Mining endpoint working"
else
    echo "❌ Mining endpoint failed"
fi

# Test validators endpoint
echo "🔐 Testing validators endpoint..."
VALIDATORS_RESPONSE=$(curl -s http://localhost:3000/api/validators)

if echo "$VALIDATORS_RESPONSE" | grep -q "validators"; then
    echo "✅ Validators endpoint working"
else
    echo "❌ Validators endpoint failed"
fi

echo ""
echo "🎯 Ready to test!"
echo "1. Open http://localhost:3001 in your browser"
echo "2. Go to Mining tab and try 'Start Mining'"
echo "3. Go to Validators tab to see validators"
echo ""
echo "Press Ctrl+C to stop all services" 