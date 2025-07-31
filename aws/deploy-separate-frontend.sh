#!/bin/bash

# Deploy Separate Frontend and Backend
# This script creates a separate frontend deployment to avoid the backend modification issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_status "🚀 Deploying Separate Frontend and Backend"
echo "=================================================="

# Configuration
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
CLUSTER_NAME="ProductiveMiner-Cluster-Custom"
SERVICE_NAME="ProductiveMiner-Service-Custom"

print_success "AWS Account ID: $AWS_ACCOUNT_ID"

# Step 1: Build the current frontend
print_status "Building current frontend..."
cd ../frontend

# Clean and rebuild
rm -rf build/
npm run build

if [ ! -d "build" ]; then
    print_error "Failed to build frontend"
    exit 1
fi

print_success "Frontend built successfully"

# Step 2: Create a simple nginx-based frontend container
print_status "Creating nginx-based frontend container..."
cd ../aws

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# Copy the frontend build
cp -r /Users/sarahmarin/TestNet/frontend/build ./public

# Create nginx configuration for React Router
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    server {
        listen 80;
        server_name localhost;
        
        root /usr/share/nginx/html;
        index index.html index.htm;
        
        # Handle React Router - serve index.html for all routes
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
}
EOF

# Create Dockerfile for frontend
cat > Dockerfile.frontend << EOF
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the frontend build
COPY public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF

print_success "Created nginx-based frontend container"

# Step 3: Build and push the frontend image
print_status "Building and pushing frontend image..."
docker build -f Dockerfile.frontend -t productiveminer-frontend-nginx .

print_success "Built frontend image"

# Tag and push to ECR
docker tag productiveminer-frontend-nginx $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest

print_success "Pushed frontend image to ECR"

# Step 4: Create a new task definition for the frontend
print_status "Creating frontend task definition..."
cat > frontend-task-definition.json << EOF
{
    "family": "ProductiveMiner-Frontend",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "executionRoleArn": "arn:aws:iam::$AWS_ACCOUNT_ID:role/ecsTaskExecutionRole",
    "containerDefinitions": [
        {
            "name": "productiveminer-frontend",
            "image": "$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest",
            "portMappings": [
                {
                    "containerPort": 80,
                    "protocol": "tcp"
                }
            ],
            "essential": true,
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/ProductiveMiner-Frontend",
                    "awslogs-region": "$REGION",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}
EOF

# Register the task definition
TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
    --cli-input-json file://frontend-task-definition.json \
    --region $REGION \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)

print_success "Registered frontend task definition: $TASK_DEFINITION_ARN"

# Step 5: Create a new service for the frontend
print_status "Creating frontend service..."

# Get existing subnets and security group
EXISTING_SUBNET1="subnet-062c0572a78e0878d"
EXISTING_SUBNET2="subnet-00173b8c5786fa4f0"
SECURITY_GROUP_ID="sg-0103ddff4b8f0def0"

# Create the frontend service
FRONTEND_SERVICE_ARN=$(aws ecs create-service \
    --cluster $CLUSTER_NAME \
    --service-name ProductiveMiner-Frontend-Service \
    --task-definition $TASK_DEFINITION_ARN \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$EXISTING_SUBNET1,$EXISTING_SUBNET2],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=ENABLED}" \
    --region $REGION \
    --query 'service.serviceArn' --output text)

print_success "Created frontend service: $FRONTEND_SERVICE_ARN"

# Step 6: Wait for frontend service to be stable
print_status "Waiting for frontend service to be stable..."
aws ecs wait services-stable \
    --cluster $CLUSTER_NAME \
    --services ProductiveMiner-Frontend-Service \
    --region $REGION

print_success "Frontend service is stable"

# Step 7: Get the frontend public IP
print_status "Getting frontend public IP..."
FRONTEND_PUBLIC_IP=$(aws ecs describe-tasks \
    --cluster $CLUSTER_NAME \
    --tasks $(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name ProductiveMiner-Frontend-Service --query 'taskArns[0]' --output text) \
    --region $REGION \
    --query 'tasks[0].attachments[0].details[?name==`publicIp`].value' \
    --output text)

if [ ! -z "$FRONTEND_PUBLIC_IP" ] && [ "$FRONTEND_PUBLIC_IP" != "None" ]; then
    print_success "Frontend public IP: $FRONTEND_PUBLIC_IP"
    
    # Test the frontend
    print_status "Testing frontend deployment..."
    sleep 30
    
    if curl -s -f http://$FRONTEND_PUBLIC_IP/ > /dev/null; then
        print_success "✅ Frontend root route working"
    else
        print_warning "⚠️ Frontend root route may have issues"
    fi
    
    if curl -s -f http://$FRONTEND_PUBLIC_IP/blocks > /dev/null; then
        print_success "✅ Frontend /blocks route working"
    else
        print_warning "⚠️ Frontend /blocks route may have issues"
    fi
    
    if curl -s -f http://$FRONTEND_PUBLIC_IP/mining > /dev/null; then
        print_success "✅ Frontend /mining route working"
    else
        print_warning "⚠️ Frontend /mining route may have issues"
    fi
    
    echo ""
    echo "🌐 Your separate frontend is now available at:"
    echo "   Frontend: http://$FRONTEND_PUBLIC_IP"
    echo "   Blocks: http://$FRONTEND_PUBLIC_IP/blocks"
    echo "   Mining: http://$FRONTEND_PUBLIC_IP/mining"
    echo "   Validators: http://$FRONTEND_PUBLIC_IP/validators"
    echo "   Analytics: http://$FRONTEND_PUBLIC_IP/analytics"
    echo "   Discoveries: http://$FRONTEND_PUBLIC_IP/discoveries"
    echo "   Wallet: http://$FRONTEND_PUBLIC_IP/wallet"
    echo "   Explorer: http://$FRONTEND_PUBLIC_IP/explorer"
    echo ""
    echo "🔧 Your backend API is still available at:"
    echo "   Backend API: http://100.26.120.55:3000/api/health"
    echo ""
    echo "🎉 Separate frontend deployment completed!"
    
else
    print_warning "Could not get frontend public IP. Please check the ECS console."
fi

# Clean up
print_status "Cleaning up temporary files..."
cd ..
rm -rf $TEMP_DIR

print_success "Separate frontend deployment completed!"
echo ""
echo "🎉 Your frontend is now deployed separately!"
echo "   This avoids the backend modification issues."
echo ""
echo "📋 What was deployed:"
echo "   - Built the current frontend from source"
echo "   - Created nginx-based frontend container"
echo "   - Deployed frontend as separate service"
echo "   - Added React Router support via nginx"
echo ""
echo "🧪 Test your frontend now!" 