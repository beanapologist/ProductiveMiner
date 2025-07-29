#!/bin/bash

# ProductiveMiner Testnet Deployment Script
set -e

echo "🚀 Starting ProductiveMiner Testnet Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || true

# Clean up old images
print_status "Cleaning up old images..."
docker system prune -f || true

# Set environment variables
export POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-"productiveminer123"}

# Build and start services
print_status "Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check if backend is running
print_status "Checking backend health..."
if curl -f http://localhost:3000/api/status > /dev/null 2>&1; then
    print_success "Backend is running and healthy!"
else
    print_error "Backend is not responding. Checking logs..."
    docker-compose logs productiveminer-backend
    exit 1
fi

# Check if frontend is running
print_status "Checking frontend health..."
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    print_success "Frontend is running and healthy!"
else
    print_warning "Frontend is not responding. Checking logs..."
    docker-compose logs productiveminer-frontend
fi

# Test mining functionality
print_status "Testing mining functionality..."
MINING_TEST=$(curl -s -X POST http://localhost:3000/api/mining/mine \
    -H "Content-Type: application/json" \
    -d '{"workType":"Test Problem","difficulty":20,"quantumSecurity":256}' \
    | jq -r '.success')

if [ "$MINING_TEST" = "true" ]; then
    print_success "Mining functionality is working!"
else
    print_warning "Mining test failed. This might be expected due to random failure rate."
fi

# Show service status
print_status "Service Status:"
docker-compose ps

print_success "Deployment completed!"
echo ""
echo "🌐 Access URLs:"
echo "   Backend API: http://localhost:3000"
echo "   Frontend: http://localhost:3001"
echo "   Block Explorer: http://localhost:3001/#/blocks"
echo "   Mining Interface: http://localhost:3001/#/mining"
echo ""
echo "📊 Monitoring:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart" 