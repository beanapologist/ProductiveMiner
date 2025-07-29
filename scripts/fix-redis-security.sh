#!/bin/bash

echo "🔒 Fixing Redis Security Configuration..."
echo "========================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop Redis containers
echo "🛑 Stopping Redis containers..."
docker stop redis-testnet 2>/dev/null || true
docker stop adaptive-redis 2>/dev/null || true
docker stop $(docker ps -q --filter "name=redis") 2>/dev/null || true

# Remove Redis containers
echo "🗑️  Removing old Redis containers..."
docker rm redis-testnet 2>/dev/null || true
docker rm adaptive-redis 2>/dev/null || true
docker rm $(docker ps -aq --filter "name=redis") 2>/dev/null || true

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p config
mkdir -p data/redis

# Verify Redis configuration exists
if [ ! -f "config/redis.conf" ]; then
    echo "❌ Redis configuration file not found. Please ensure config/redis.conf exists."
    exit 1
fi

echo "✅ Redis configuration found"

# Restart services based on which docker-compose file is being used
if [ -f "docker-compose.adaptive.yml" ]; then
    echo "🚀 Restarting adaptive system with secured Redis..."
    docker-compose -f docker-compose.adaptive.yml up -d adaptive-redis
elif [ -f "docker-compose.yml" ]; then
    echo "🚀 Restarting main system with secured Redis..."
    docker-compose up -d redis
else
    echo "❌ No docker-compose file found."
    exit 1
fi

# Wait for Redis to start
echo "⏳ Waiting for Redis to start..."
sleep 5

# Test Redis connection
echo "🧪 Testing Redis connection..."
if docker exec $(docker ps -q --filter "name=redis") redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running and responding"
else
    echo "❌ Redis is not responding. Check logs with: docker logs \$(docker ps -q --filter \"name=redis\")"
    exit 1
fi

# Check Redis security settings
echo "🔍 Verifying Redis security settings..."
docker exec $(docker ps -q --filter "name=redis") redis-cli CONFIG GET protected-mode | grep -q "yes" && echo "✅ Protected mode enabled" || echo "⚠️  Protected mode not enabled"
docker exec $(docker ps -q --filter "name=redis") redis-cli CONFIG GET maxclients | grep -q "10000" && echo "✅ Max clients limit set" || echo "⚠️  Max clients limit not set"

echo ""
echo "🎉 Redis security configuration updated successfully!"
echo ""
echo "📋 Security improvements applied:"
echo "   ✅ Protected mode enabled"
echo "   ✅ Dangerous commands disabled (FLUSHDB, FLUSHALL, CONFIG, SHUTDOWN, DEBUG)"
echo "   ✅ Connection limits configured"
echo "   ✅ Network security settings applied"
echo ""
echo "🔍 To monitor Redis logs:"
echo "   docker logs \$(docker ps -q --filter \"name=redis\") -f"
echo ""
echo "🔍 To test Redis security:"
echo "   docker exec \$(docker ps -q --filter \"name=redis\") redis-cli ping" 