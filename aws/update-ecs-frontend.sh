#!/bin/bash

echo "🚀 Updating ECS Frontend with latest GitHub code..."

# Configuration - Update these values
REGION="us-east-1"  # Change to your region
ACCOUNT_ID="your-account-id"  # Change to your AWS account ID
ECR_REPO="your-ecr-repo-name"  # Change to your ECR repository name
CLUSTER_NAME="your-cluster-name"  # Change to your ECS cluster name
SERVICE_NAME="your-service-name"  # Change to your ECS service name

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Pulling latest code from GitHub...${NC}"
git pull origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code pulled successfully${NC}"
else
    echo -e "${RED}❌ Failed to pull code${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 2: Logging into ECR...${NC}"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ ECR login successful${NC}"
else
    echo -e "${RED}❌ ECR login failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 3: Building Docker image...${NC}"
docker build -t $ECR_REPO:latest ./frontend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker build successful${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 4: Tagging image for ECR...${NC}"
docker tag $ECR_REPO:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPO:latest

echo -e "${YELLOW}Step 5: Pushing to ECR...${NC}"
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPO:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Image pushed to ECR successfully${NC}"
else
    echo -e "${RED}❌ Failed to push to ECR${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 6: Updating ECS service...${NC}"
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ ECS service updated successfully${NC}"
else
    echo -e "${RED}❌ Failed to update ECS service${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 7: Monitoring deployment...${NC}"
echo "Waiting for deployment to complete..."
aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_NAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    echo -e "${GREEN}🎉 Your frontend is now updated with the latest GitHub code${NC}"
else
    echo -e "${RED}❌ Deployment failed or timed out${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Frontend Update Complete!${NC}"
echo "Your ECS service is now running the latest frontend from GitHub."
echo "Remember to clear your browser cache or do a hard refresh (Ctrl+Shift+R)." 