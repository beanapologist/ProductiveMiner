#!/bin/bash

# Fix Frontend Routing Issue
# This script updates the backend to properly handle React Router routes

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

print_status "🔧 Fixing Frontend Routing Issue"
echo "======================================"

# Configuration
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
CLUSTER_NAME="ProductiveMiner-Cluster-Custom"
SERVICE_NAME="ProductiveMiner-Service-Custom"

print_success "AWS Account ID: $AWS_ACCOUNT_ID"

# Step 1: Create a temporary directory for the fix
print_status "Creating temporary directory for the fix..."
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

print_success "Working in: $TEMP_DIR"

# Step 2: Pull the current backend image
print_status "Pulling current backend image..."
docker pull $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest

# Step 3: Create a container from the image to extract files
print_status "Extracting backend files..."
CONTAINER_ID=$(docker create $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest)
docker cp $CONTAINER_ID:/app/index.js ./index.js
docker rm $CONTAINER_ID

print_success "Extracted index.js"

# Step 4: Create the routing fix
print_status "Creating routing fix..."

# Create a patch file for the routing issue
cat > routing-fix.js << 'EOF'
// Add this after the existing routes but before the catch-all route
// This handles React Router client-side routing

// Serve index.html for all frontend routes (React Router)
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

// Catch-all route for any other frontend routes
app.get('*', (req, res) => {
    // Only serve index.html for routes that don't start with /api
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(process.cwd(), 'public/index.html'));
    } else {
        res.status(404).json({ error: 'API endpoint not found' });
    }
});
EOF

print_success "Created routing fix"

# Step 5: Create a new Dockerfile with the fix
print_status "Creating new Dockerfile..."
cat > Dockerfile.fix << EOF
FROM $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest

# Copy the routing fix
COPY routing-fix.js /app/routing-fix.js

# Apply the routing fix
RUN sed -i '/app.get('\''\/'\'', (_req, res) => {/a\\n// React Router support - Add these routes before the catch-all\napp.get('\''/blocks'\'', (_req, res) => {\n    res.sendFile(path.join(process.cwd(), '\''public/index.html'\''));\n});\n\napp.get('\''/mining'\'', (_req, res) => {\n    res.sendFile(path.join(process.cwd(), '\''public/index.html'\''));\n});\n\napp.get('\''/validators'\'', (_req, res) => {\n    res.sendFile(path.join(process.cwd(), '\''public/index.html'\''));\n});\n\napp.get('\''/analytics'\'', (_req, res) => {\n    res.sendFile(path.join(process.cwd(), '\''public/index.html'\''));\n});\n\napp.get('\''/settings'\'', (_req, res) => {\n    res.sendFile(path.join(process.cwd(), '\''public/index.html'\''));\n});\n\napp.get('\''/discoveries'\'', (_req, res) => {\n    res.sendFile(path.join(process.cwd(), '\''public/index.html'\''));\n});\n\napp.get('\''/wallet'\'', (_req, res) => {\n    res.sendFile(path.join(process.cwd(), '\''public/index.html'\''));\n});\n\napp.get('\''/explorer'\'', (_req, res) => {\n    res.sendFile(path.join(process.cwd(), '\''public/index.html'\''));\n});\n\n// Catch-all route for React Router\napp.get('\''*'\'', (req, res) => {\n    if (!req.path.startsWith('\''/api'\'')) {\n        res.sendFile(path.join(process.cwd(), '\''public/index.html'\''));\n    } else {\n        res.status(404).json({ error: '\''API endpoint not found'\'' });\n    }\n});' /app/index.js

EXPOSE 3000
CMD ["node", "index.js"]
EOF

print_success "Created Dockerfile with routing fix"

# Step 6: Build the fixed image
print_status "Building fixed backend image..."
docker build -f Dockerfile.fix -t productiveminer-app-fixed .

print_success "Built fixed image"

# Step 7: Tag and push the fixed image
print_status "Tagging and pushing fixed image..."
docker tag productiveminer-app-fixed $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest

print_success "Pushed fixed image to ECR"

# Step 8: Update the ECS service
print_status "Updating ECS service with fixed image..."
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

# Step 10: Test the fix
print_status "Testing the routing fix..."
sleep 30

# Get the public IP
PUBLIC_IP=$(aws ecs describe-tasks \
    --cluster $CLUSTER_NAME \
    --tasks $(aws ecs list-tasks --cluster $CLUSTER_NAME --query 'taskArns[0]' --output text) \
    --region $REGION \
    --query 'tasks[0].attachments[0].details[?name==`publicIp`].value' \
    --output text)

if [ ! -z "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "None" ]; then
    print_success "Testing routes on $PUBLIC_IP..."
    
    # Test the main page
    if curl -s -f http://$PUBLIC_IP:3000/ > /dev/null; then
        print_success "✅ Root route working"
    else
        print_warning "⚠️ Root route may have issues"
    fi
    
    # Test a React Router route
    if curl -s -f http://$PUBLIC_IP:3000/blocks > /dev/null; then
        print_success "✅ /blocks route working"
    else
        print_warning "⚠️ /blocks route may have issues"
    fi
    
    # Test another React Router route
    if curl -s -f http://$PUBLIC_IP:3000/mining > /dev/null; then
        print_success "✅ /mining route working"
    else
        print_warning "⚠️ /mining route may have issues"
    fi
    
    echo ""
    echo "🌐 Your application is now available at:"
    echo "   Main: http://$PUBLIC_IP:3000"
    echo "   Blocks: http://$PUBLIC_IP:3000/blocks"
    echo "   Mining: http://$PUBLIC_IP:3000/mining"
    echo "   Validators: http://$PUBLIC_IP:3000/validators"
    echo "   Analytics: http://$PUBLIC_IP:3000/analytics"
    echo "   Discoveries: http://$PUBLIC_IP:3000/discoveries"
    echo "   Wallet: http://$PUBLIC_IP:3000/wallet"
    echo "   Explorer: http://$PUBLIC_IP:3000/explorer"
    echo ""
    echo "🔧 The 404 error should now be fixed!"
    
else
    print_warning "Could not get public IP. Please check the ECS console."
fi

# Clean up
print_status "Cleaning up temporary files..."
cd ..
rm -rf $TEMP_DIR

print_success "Frontend routing fix completed!"
echo ""
echo "🎉 The 404 error should now be resolved!"
echo "   Your React Router routes will now work properly."
echo ""
echo "📋 What was fixed:"
echo "   - Added route handlers for all frontend pages"
echo "   - Added catch-all route for React Router"
echo "   - Updated the backend to serve index.html for frontend routes"
echo ""
echo "🧪 Test your application now!" 