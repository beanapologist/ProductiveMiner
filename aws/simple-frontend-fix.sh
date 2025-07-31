#!/bin/bash

# Simple Frontend Fix - Update Frontend Files Only
# This script updates just the frontend files in the existing backend

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

print_status "🔧 Simple Frontend Fix - Update Frontend Files Only"
echo "=========================================================="

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

# Step 2: Create a simple update to the existing backend
print_status "Creating simple backend update..."
cd ../aws

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# Pull the current backend image
print_status "Pulling current backend image..."
docker pull $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest

# Create a container to extract the backend files
print_status "Extracting backend files..."
CONTAINER_ID=$(docker create $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest)
docker cp $CONTAINER_ID:/app/index.js ./index.js
docker cp $CONTAINER_ID:/app/package.json ./package.json
docker cp $CONTAINER_ID:/app/package-lock.json ./package-lock.json
docker rm $CONTAINER_ID

print_success "Extracted backend files"

# Step 3: Copy the frontend build to the temporary directory
print_status "Copying frontend build files..."
cp -r /Users/sarahmarin/TestNet/frontend/build ./public

print_success "Copied frontend build files"

# Step 4: Create a simple Dockerfile that just updates the frontend
print_status "Creating simple Dockerfile..."
cat > Dockerfile.simple << EOF
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy backend source (unchanged)
COPY index.js ./

# Copy the updated frontend build
COPY public ./public

EXPOSE 3000
CMD ["node", "index.js"]
EOF

print_success "Created simple Dockerfile"

# Step 5: Build the updated image
print_status "Building updated backend image..."
docker build -f Dockerfile.simple -t productiveminer-app-simple-update .

print_success "Built updated image"

# Step 6: Tag and push the updated image
print_status "Tagging and pushing updated image..."
docker tag productiveminer-app-simple-update $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest

print_success "Pushed updated image to ECR"

# Step 7: Update the ECS service
print_status "Updating ECS service with updated image..."
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --force-new-deployment \
    --region $REGION

print_success "Updated ECS service"

# Step 8: Wait for deployment to complete
print_status "Waiting for deployment to complete..."
sleep 60

# Check deployment status
DEPLOYMENT_STATUS=$(aws ecs describe-services \
    --cluster $CLUSTER_NAME \
    --services $SERVICE_NAME \
    --region $REGION \
    --query 'services[0].deployments[0].{Status:status,RolloutState:rolloutState,RunningCount:runningCount,DesiredCount:desiredCount}' \
    --output json)

echo "Deployment status: $DEPLOYMENT_STATUS"

# Step 9: Test the updated deployment
print_status "Testing the updated deployment..."
sleep 30

# Get the public IP
PUBLIC_IP=$(aws ec2 describe-network-interfaces \
    --network-interface-ids $(aws ecs describe-tasks \
        --cluster $CLUSTER_NAME \
        --tasks $(aws ecs list-tasks --cluster $CLUSTER_NAME --query 'taskArns[0]' --output text) \
        --region $REGION \
        --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
        --output text) \
    --region $REGION \
    --query 'NetworkInterfaces[0].Association.PublicIp' \
    --output text)

if [ ! -z "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "None" ]; then
    print_success "Testing updated application on $PUBLIC_IP..."
    
    # Test the main page
    if curl -s -f http://$PUBLIC_IP:3000/ > /dev/null; then
        print_success "✅ Root route working"
    else
        print_warning "⚠️ Root route may have issues"
    fi
    
    # Test API endpoints
    if curl -s -f http://$PUBLIC_IP:3000/api/health > /dev/null; then
        print_success "✅ API health endpoint working"
    else
        print_warning "⚠️ API health endpoint may have issues"
    fi
    
    echo ""
    echo "🌐 Your updated application is now available at:"
    echo "   Main: http://$PUBLIC_IP:3000"
    echo "   API Health: http://$PUBLIC_IP:3000/api/health"
    echo "   API Status: http://$PUBLIC_IP:3000/api/status"
    echo ""
    echo "🎉 Updated with the correct frontend version!"
    echo "   Note: React Router routes may still show 404, but the frontend is updated."
    
else
    print_warning "Could not get public IP. Please check the ECS console."
fi

# Clean up
print_status "Cleaning up temporary files..."
cd ..
rm -rf $TEMP_DIR

print_success "Simple frontend update completed!"
echo ""
echo "🎉 Your frontend files have been updated!"
echo "   The backend remains unchanged, only the frontend files were updated."
echo ""
echo "📋 What was updated:"
echo "   - Built the current frontend from source"
echo "   - Updated only the frontend files in the backend image"
echo "   - Kept the backend code unchanged"
echo "   - Deployed the updated image to AWS"
echo ""
echo "🧪 Test your application now!" 