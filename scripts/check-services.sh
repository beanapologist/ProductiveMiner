#!/bin/bash

echo "🔍 Checking ProductiveMiner Services Status..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service
check_service() {
    local name=$1
    local url=$2
    local description=$3
    
    echo -n "Checking $name... "
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Function to check container
check_container() {
    local name=$1
    local description=$2
    
    echo -n "Checking $name container... "
    
    if docker ps | grep -q "$name"; then
        local status=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep "$name" | awk '{print $2}')
        if [[ $status == *"Up"* ]]; then
            echo -e "${GREEN}✅ Running ($status)${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  Container exists but not running${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Not found${NC}"
        return 1
    fi
}

echo ""
echo "🐳 Container Status:"
echo "-------------------"

check_container "adaptive-frontend" "Frontend (React/nginx)"
check_container "adaptive-app" "Backend (Node.js API)"
check_container "adaptive-db" "Database (PostgreSQL)"
check_container "adaptive-redis" "Cache (Redis)"
check_container "adaptive-blockchain-node" "Blockchain (Ganache)"
check_container "adaptive-nginx" "Reverse Proxy (nginx)"
check_container "adaptive-monitor" "Monitoring (Grafana)"
check_container "adaptive-metrics" "Metrics (Prometheus)"

echo ""
echo "🌐 Service Accessibility:"
echo "------------------------"

check_service "Frontend" "http://localhost:3001" "React application"
check_service "Backend API" "http://localhost:3000/api/health" "Node.js API"
check_service "Blockchain" "http://localhost:8545" "Ganache blockchain"
check_service "Grafana" "http://localhost:3002" "Monitoring dashboard"
check_service "Prometheus" "http://localhost:9090" "Metrics collection"

echo ""
echo "🔧 Additional Checks:"
echo "-------------------"

# Check Redis connection
echo -n "Checking Redis connection... "
if docker exec adaptive-redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

# Check database connection
echo -n "Checking database connection... "
if docker exec adaptive-db pg_isready -U adaptive_user > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo ""
echo "📊 Summary:"
echo "----------"

# Count running containers
running_containers=$(docker ps --format "table {{.Names}}" | grep adaptive | wc -l)
total_containers=8

echo "Containers running: $running_containers/$total_containers"

if [ $running_containers -eq $total_containers ]; then
    echo -e "${GREEN}🎉 All services are running!${NC}"
else
    echo -e "${YELLOW}⚠️  Some services may need attention${NC}"
fi

echo ""
echo "🔍 Troubleshooting Commands:"
echo "---------------------------"
echo "View logs: docker logs <container-name>"
echo "Restart service: docker-compose -f docker-compose.adaptive.yml restart <service-name>"
echo "Check specific service: curl -I http://localhost:<port>" 