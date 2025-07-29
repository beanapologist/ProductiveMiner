#!/bin/bash

echo "🐳 Deploying ProductiveMiner Adaptive Learning System to Docker..."
echo "================================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it and try again."
    exit 1
fi

echo "✅ Docker environment ready"

# Stop any existing containers that might conflict
echo "🛑 Stopping conflicting containers..."
docker stop redis-testnet 2>/dev/null || true
docker stop $(docker ps -q --filter "publish=6379") 2>/dev/null || true
docker stop $(docker ps -q --filter "publish=5432") 2>/dev/null || true
docker stop $(docker ps -q --filter "publish=3002") 2>/dev/null || true
docker stop $(docker ps -q --filter "publish=9090") 2>/dev/null || true

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p config
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources
mkdir -p monitoring/prometheus
mkdir -p nginx
mkdir -p ssl
mkdir -p frontend

# Create adaptive genesis configuration
echo "📝 Creating adaptive genesis configuration..."
cat > config/adaptive-genesis.json << 'EOF'
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
  "difficulty": "1",
  "gasLimit": "8000000",
  "alloc": {
    "0x1234567890123456789012345678901234567890": {
      "balance": "10000000000000000000000"
    }
  }
}
EOF

# Create nginx configuration
echo "🌐 Creating nginx configuration..."
cat > nginx/adaptive.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream adaptive_app {
        server adaptive-app:3000;
    }

    upstream adaptive_frontend {
        server adaptive-frontend:3000;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            proxy_pass http://adaptive_frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API
        location /api/ {
            proxy_pass http://adaptive_app/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /health {
            proxy_pass http://adaptive_app/health;
        }
    }
}
EOF

# Create Prometheus configuration
echo "📊 Creating Prometheus configuration..."
cat > monitoring/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'adaptive-app'
    static_configs:
      - targets: ['adaptive-app:3001']
    metrics_path: '/metrics'

  - job_name: 'adaptive-node'
    static_configs:
      - targets: ['adaptive-node:8545']
    metrics_path: '/metrics'

  - job_name: 'adaptive-frontend'
    static_configs:
      - targets: ['adaptive-frontend:3000']
    metrics_path: '/health'
EOF

# Create Grafana datasource
echo "📈 Creating Grafana datasource..."
mkdir -p monitoring/grafana/datasources
cat > monitoring/grafana/datasources/prometheus.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://adaptive-metrics:9090
    isDefault: true
EOF

# Create Grafana dashboard
echo "📊 Creating Grafana dashboard..."
mkdir -p monitoring/grafana/dashboards
cat > monitoring/grafana/dashboards/adaptive-dashboard.json << 'EOF'
{
  "dashboard": {
    "id": null,
    "title": "Adaptive Learning Dashboard",
    "tags": ["adaptive", "learning"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Block Creation Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(blocks_created_total[5m])",
            "legendFormat": "Blocks/sec"
          }
        ]
      },
      {
        "id": 2,
        "title": "Algorithm Efficiency",
        "type": "graph",
        "targets": [
          {
            "expr": "algorithm_efficiency",
            "legendFormat": "Efficiency"
          }
        ]
      },
      {
        "id": 3,
        "title": "Security Strength",
        "type": "graph",
        "targets": [
          {
            "expr": "security_strength",
            "legendFormat": "Strength"
          }
        ]
      },
      {
        "id": 4,
        "title": "Frontend Performance",
        "type": "graph",
        "targets": [
          {
            "expr": "up{job=\"adaptive-frontend\"}",
            "legendFormat": "Frontend Status"
          }
        ]
      }
    ]
  }
}
EOF

echo "✅ Configuration files created"

# Build and start the Docker containers
echo "🐳 Building and starting Docker containers..."
docker-compose -f docker-compose.adaptive.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 45

# Check service status
echo "🔍 Checking service status..."
docker-compose -f docker-compose.adaptive.yml ps

# Display access information
echo ""
echo "🎉 Adaptive Learning System Deployed Successfully!"
echo "=================================================="
echo ""
echo "🌐 Frontend Application: http://localhost:3002"
echo "   - Modern React interface for adaptive learning system"
echo "   - Real-time dashboard and analytics"
echo "   - Block explorer and mining control"
echo "   - Validator panel and settings"
echo ""
echo "📊 Monitoring Dashboard: http://localhost:3003"
echo "   Username: admin"
echo "   Password: adaptive_admin"
echo ""
echo "📈 Metrics: http://localhost:9091"
echo "🔗 API: http://localhost:3000"
echo "🌐 Web Interface: http://localhost:80"
echo ""
echo "🧪 Test the system:"
echo "   curl http://localhost:3000/health"
echo "   curl http://localhost:3002/health"
echo ""
echo "📊 View logs:"
echo "   docker-compose -f docker-compose.adaptive.yml logs -f"
echo ""
echo "🛑 Stop the system:"
echo "   docker-compose -f docker-compose.adaptive.yml down"
echo ""

echo "✅ Docker deployment complete!" 