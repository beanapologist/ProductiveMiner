#!/bin/bash

# Simple Frontend Update - Manual Route Addition
# This script updates the deployment with the current frontend version using a simpler approach

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

print_status "🔄 Simple Frontend Update with Manual Route Addition"
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

# Step 2: Create a new Dockerfile for the updated backend
print_status "Creating updated backend with correct frontend..."
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

# Step 4: Manually add React Router routes to index.js
print_status "Adding React Router routes to backend..."
cat >> index.js << 'EOF'

// React Router support - Add these routes after the existing routes
app.get('/blocks', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.get('/mining', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.get('/validators', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.get('/analytics', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.get('/settings', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.get('/discoveries', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.get('/wallet', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.get('/explorer', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

// Catch-all route for React Router
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(process.cwd(), 'public/index.html'));
    } else {
        res.status(404).json({ error: 'API endpoint not found' });
    }
});
EOF

print_success "Added React Router routes"

# Step 5: Create a simple Dockerfile
print_status "Creating simple Dockerfile..."
cat > Dockerfile.simple << EOF
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy backend source (with React Router routes already added)
COPY index.js ./

# Copy the updated frontend build
COPY public ./public

EXPOSE 3000
CMD ["node", "index.js"]
EOF

print_success "Created simple Dockerfile"

# Step 6: Build the updated image
print_status "Building updated backend image..."
docker build -f Dockerfile.simple -t productiveminer-app-simple .

print_success "Built updated image"

# Step 7: Tag and push the updated image
print_status "Tagging and pushing updated image..."
docker tag productiveminer-app-simple $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest

print_success "Pushed updated image to ECR"

# Step 8: Update the ECS service
print_status "Updating ECS service with updated image..."
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --force-new-deployment \
    --region $REGION

print_success "Updated ECS service"

# Step 9: Wait for deployment to complete
print_status "Waiting for deployment to complete..."
aws ecs wait services-stable \
    --cluster $CLUSTER_NAME \
    --services $SERVICE_NAME \
    --region $REGION

print_success "Deployment completed"

# Step 10: Test the updated deployment
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
    
    # Test React Router routes
    if curl -s -f http://$PUBLIC_IP:3000/blocks > /dev/null; then
        print_success "✅ /blocks route working"
    else
        print_warning "⚠️ /blocks route may have issues"
    fi
    
    if curl -s -f http://$PUBLIC_IP:3000/mining > /dev/null; then
        print_success "✅ /mining route working"
    else
        print_warning "⚠️ /mining route may have issues"
    fi
    
    echo ""
    echo "🌐 Your updated application is now available at:"
    echo "   Main: http://$PUBLIC_IP:3000"
    echo "   Blocks: http://$PUBLIC_IP:3000/blocks"
    echo "   Mining: http://$PUBLIC_IP:3000/mining"
    echo "   Validators: http://$PUBLIC_IP:3000/validators"
    echo "   Analytics: http://$PUBLIC_IP:3000/analytics"
    echo "   Discoveries: http://$PUBLIC_IP:3000/discoveries"
    echo "   Wallet: http://$PUBLIC_IP:3000/wallet"
    echo "   Explorer: http://$PUBLIC_IP:3000/explorer"
    echo ""
    echo "🎉 Updated with the correct frontend version!"
    
else
    print_warning "Could not get public IP. Please check the ECS console."
fi

# Clean up
print_status "Cleaning up temporary files..."
cd ..
rm -rf $TEMP_DIR

print_success "Frontend deployment update completed!"
echo ""
echo "🎉 Your deployment now has the correct frontend version!"
echo "   The old version has been replaced with the current version from port 3004."
echo ""
echo "📋 What was updated:"
echo "   - Built the current frontend from source"
echo "   - Updated the backend image with the new frontend"
echo "   - Added React Router support for all routes (manual method)"
echo "   - Deployed the updated image to AWS"
echo ""
echo "🧪 Test your application now!" 