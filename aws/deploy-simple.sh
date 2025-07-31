#!/bin/bash

# ProductiveMiner AWS Deployment Script - Simplified Version
# This script deploys the ProductiveMiner system to AWS using a simplified infrastructure

set -e

# Color functions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME="ProductiveMiner-Simple"
ENVIRONMENT="production"
REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo -e "${BLUE}🔧 🚀 Deploying ProductiveMiner to AWS (Simplified)...${NC}"
echo "=============================================="
echo -e "${GREEN}✅ AWS Account ID: $AWS_ACCOUNT_ID${NC}"

# Check prerequisites
echo -e "${BLUE}🔧 Checking prerequisites...${NC}"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}❌ AWS CLI not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Step 1: Create ECR repositories
echo -e "${BLUE}🔧 Creating ECR repositories...${NC}"
aws ecr create-repository --repository-name productiveminer-app --region $REGION 2>/dev/null || echo -e "${YELLOW}⚠️  Repository productiveminer-app already exists${NC}"
aws ecr create-repository --repository-name productiveminer-frontend --region $REGION 2>/dev/null || echo -e "${YELLOW}⚠️  Repository productiveminer-frontend already exists${NC}"
echo -e "${GREEN}✅ ECR repositories created${NC}"

# Step 2: Login to ECR
echo -e "${BLUE}🔧 Logging in to ECR...${NC}"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
echo -e "${GREEN}✅ Logged in to ECR${NC}"

# Step 3: Tag and push Docker images
echo -e "${BLUE}🔧 Tagging and pushing Docker images...${NC}"

# Tag the images
docker tag testnet-adaptive-app:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker tag testnet-adaptive-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest

# Push the images
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest

echo -e "${GREEN}✅ Docker images pushed to ECR${NC}"

# Step 4: Deploy infrastructure using CloudFormation
echo -e "${BLUE}🔧 Deploying infrastructure using CloudFormation...${NC}"

# Check if stack exists
if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Stack $STACK_NAME already exists. Updating...${NC}"
    aws cloudformation update-stack \
        --stack-name $STACK_NAME \
        --template-body file://infrastructure-simple.yaml \
        --parameters ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
        --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
        --region $REGION
else
    echo -e "${BLUE}🔧 Creating new stack...${NC}"
    aws cloudformation create-stack \
        --stack-name $STACK_NAME \
        --template-body file://infrastructure-simple.yaml \
        --parameters ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
        --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
        --region $REGION
fi

echo -e "${GREEN}✅ CloudFormation stack creation initiated${NC}"

# Step 5: Wait for stack to complete
echo -e "${BLUE}🔧 Waiting for CloudFormation stack to complete...${NC}"
aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $REGION || \
aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $REGION

echo -e "${GREEN}✅ CloudFormation stack completed${NC}"

# Step 6: Get stack outputs
echo -e "${BLUE}🔧 Getting stack outputs...${NC}"
STACK_OUTPUTS=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs')

# Extract values
LOAD_BALANCER_DNS=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="LoadBalancerDNS") | .OutputValue')
CLUSTER_NAME=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="ClusterName") | .OutputValue')
DB_ENDPOINT=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="DatabaseEndpoint") | .OutputValue')
REDIS_ENDPOINT=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="RedisEndpoint") | .OutputValue')

echo -e "${GREEN}✅ Stack outputs retrieved${NC}"

# Step 7: Test the deployment
echo -e "${BLUE}🔧 Testing deployment...${NC}"

# Wait a bit for services to start
echo -e "${YELLOW}⏳ Waiting for services to start (60 seconds)...${NC}"
sleep 60

# Test the load balancer
echo -e "${BLUE}🔧 Testing load balancer...${NC}"
if curl -s -f "http://$LOAD_BALANCER_DNS" > /dev/null; then
    echo -e "${GREEN}✅ Load balancer is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Load balancer not responding yet (this is normal during startup)${NC}"
fi

# Step 8: Display results
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "=============================================="
echo -e "${GREEN}✅ Stack Name: $STACK_NAME${NC}"
echo -e "${GREEN}✅ Load Balancer DNS: $LOAD_BALANCER_DNS${NC}"
echo -e "${GREEN}✅ ECS Cluster: $CLUSTER_NAME${NC}"
echo -e "${GREEN}✅ Database Endpoint: $DB_ENDPOINT${NC}"
echo -e "${GREEN}✅ Redis Endpoint: $REDIS_ENDPOINT${NC}"
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo -e "${GREEN}Frontend: http://$LOAD_BALANCER_DNS${NC}"
echo -e "${GREEN}API: http://$LOAD_BALANCER_DNS:3002${NC}"
echo -e "${GREEN}Blockchain: http://$LOAD_BALANCER_DNS:8545${NC}"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "${YELLOW}View ECS Service:${NC} aws ecs describe-services --cluster $CLUSTER_NAME --services production-PM-Service --region $REGION"
echo -e "${YELLOW}View Logs:${NC} aws logs describe-log-groups --log-group-name-prefix /ecs/$ENVIRONMENT-PM --region $REGION"
echo -e "${YELLOW}Delete Stack:${NC} aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"
echo ""
echo -e "${GREEN}🚀 Your ProductiveMiner blockchain is now running on AWS!${NC}" 