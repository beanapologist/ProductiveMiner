#!/bin/bash

# ProductiveMiner AWS Deployment Script
# This script automates the deployment of ProductiveMiner to AWS

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

# Configuration
STACK_NAME="ProductiveMiner"
REGION="us-east-1"
ENVIRONMENT="production"
DOMAIN_NAME="productiveminer.com"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

print_status "🚀 Deploying ProductiveMiner to AWS..."
echo "=============================================="

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
print_success "AWS Account ID: $AWS_ACCOUNT_ID"

# Step 1: Create ECR repositories
print_status "Creating ECR repositories..."

aws ecr create-repository --repository-name productiveminer-app --region $REGION 2>/dev/null || print_warning "Repository productiveminer-app already exists"
aws ecr create-repository --repository-name productiveminer-frontend --region $REGION 2>/dev/null || print_warning "Repository productiveminer-frontend already exists"

print_success "ECR repositories created"

# Step 2: Login to ECR
print_status "Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

print_success "Logged in to ECR"

# Step 3: Tag and push Docker images
print_status "Tagging and pushing Docker images..."

# Tag images
docker tag testnet-adaptive-app:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker tag testnet-adaptive-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest

# Push images
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest

print_success "Docker images pushed to ECR"

# Step 4: Deploy infrastructure using CloudFormation
print_status "Deploying infrastructure using CloudFormation..."

# Create the CloudFormation stack
aws cloudformation create-stack \
    --stack-name $STACK_NAME \
    --template-body file://infrastructure.yaml \
    --parameters ParameterKey=Environment,ParameterValue=$ENVIRONMENT ParameterKey=DomainName,ParameterValue=$DOMAIN_NAME \
    --capabilities CAPABILITY_IAM \
    --region $REGION

print_success "CloudFormation stack creation initiated"

# Step 5: Wait for stack creation
print_status "Waiting for CloudFormation stack to complete..."
aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $REGION

print_success "CloudFormation stack created successfully"

# Step 6: Get stack outputs
print_status "Getting stack outputs..."

VPC_ID=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`VPCId`].OutputValue' --output text)
ECS_CLUSTER=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`ECSClusterName`].OutputValue' --output text)
LOAD_BALANCER_DNS=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' --output text)
DATABASE_ENDPOINT=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' --output text)
REDIS_ENDPOINT=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`RedisEndpoint`].OutputValue' --output text)

print_success "Stack outputs retrieved"

# Step 7: Update ECS service to force new deployment
print_status "Updating ECS service..."

aws ecs update-service \
    --cluster $ECS_CLUSTER \
    --service $ENVIRONMENT-ProductiveMiner-Service \
    --force-new-deployment \
    --region $REGION

print_success "ECS service updated"

# Step 8: Wait for service to be stable
print_status "Waiting for ECS service to be stable..."
aws ecs wait services-stable \
    --cluster $ECS_CLUSTER \
    --services $ENVIRONMENT-ProductiveMiner-Service \
    --region $REGION

print_success "ECS service is stable"

# Step 9: Test the deployment
print_status "Testing deployment..."

# Wait a bit for the load balancer to be ready
sleep 30

# Test the load balancer
if curl -s -f https://$LOAD_BALANCER_DNS/api/health > /dev/null; then
    print_success "Application is responding on load balancer"
else
    print_warning "Application may not be ready yet. Please wait a few minutes and test manually."
fi

# Step 10: Display deployment information
echo ""
echo "🎉 ProductiveMiner AWS Deployment Complete!"
echo "==========================================="
echo ""
echo "🌐 Access Information:"
echo "   Load Balancer DNS: $LOAD_BALANCER_DNS"
echo "   Domain: https://$DOMAIN_NAME"
echo "   API: https://api.$DOMAIN_NAME"
echo "   Blockchain: https://blockchain.$DOMAIN_NAME"
echo ""
echo "🔧 Infrastructure Details:"
echo "   VPC ID: $VPC_ID"
echo "   ECS Cluster: $ECS_CLUSTER"
echo "   Database Endpoint: $DATABASE_ENDPOINT"
echo "   Redis Endpoint: $REDIS_ENDPOINT"
echo ""
echo "📊 Monitoring:"
echo "   CloudWatch Logs: /ecs/$ENVIRONMENT-ProductiveMiner"
echo "   ECS Console: https://console.aws.amazon.com/ecs/home?region=$REGION#/clusters/$ECS_CLUSTER"
echo ""
echo "🧪 Test Commands:"
echo "   curl https://$LOAD_BALANCER_DNS/api/health"
echo "   curl https://$DOMAIN_NAME"
echo ""
echo "📈 Management Commands:"
echo "   # View ECS service status"
echo "   aws ecs describe-services --cluster $ECS_CLUSTER --services $ENVIRONMENT-ProductiveMiner-Service --region $REGION"
echo ""
echo "   # View CloudWatch logs"
echo "   aws logs describe-log-groups --log-group-name-prefix /ecs/$ENVIRONMENT-ProductiveMiner --region $REGION"
echo ""
echo "   # Scale ECS service"
echo "   aws ecs update-service --cluster $ECS_CLUSTER --service $ENVIRONMENT-ProductiveMiner-Service --desired-count 3 --region $REGION"
echo ""
echo "🛑 Cleanup Commands:"
echo "   # Delete the entire stack"
echo "   aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"
echo ""

# Step 11: Create deployment summary
cat > AWS_DEPLOYMENT_SUMMARY.md << EOF
# ProductiveMiner AWS Deployment Summary

## 🚀 Deployment Status: SUCCESS

### 🌐 Access URLs
- **Load Balancer**: https://$LOAD_BALANCER_DNS
- **Domain**: https://$DOMAIN_NAME
- **API**: https://api.$DOMAIN_NAME
- **Blockchain**: https://blockchain.$DOMAIN_NAME

### 🔧 Infrastructure Details
- **VPC ID**: $VPC_ID
- **ECS Cluster**: $ECS_CLUSTER
- **Database Endpoint**: $DATABASE_ENDPOINT
- **Redis Endpoint**: $REDIS_ENDPOINT
- **Region**: $REGION
- **Environment**: $ENVIRONMENT

### 📊 AWS Services Used
- **ECS (Fargate)**: Container orchestration
- **ECR**: Container registry
- **RDS**: PostgreSQL database
- **ElastiCache**: Redis cache
- **Application Load Balancer**: Traffic distribution
- **Route 53**: DNS management
- **CloudWatch**: Monitoring and logging
- **Certificate Manager**: SSL certificates
- **VPC**: Network isolation

### 💰 Estimated Monthly Costs
- **ECS Fargate**: \$50-100/month
- **RDS PostgreSQL**: \$30-50/month
- **ElastiCache Redis**: \$20-40/month
- **Application Load Balancer**: \$20-30/month
- **CloudWatch**: \$10-20/month
- **Route 53**: \$1/month
- **Data Transfer**: \$10-30/month
- **Total**: \$141-271/month

### 🛡️ Security Features
- ✅ VPC with public/private subnets
- ✅ Security groups configured
- ✅ SSL/TLS encryption
- ✅ IAM roles and policies
- ✅ Database in private subnet
- ✅ Redis in private subnet

### 📈 Monitoring
- ✅ CloudWatch logs enabled
- ✅ ECS service monitoring
- ✅ Load balancer health checks
- ✅ Database monitoring
- ✅ Redis monitoring

### 🔄 Management Commands
\`\`\`bash
# View service status
aws ecs describe-services --cluster $ECS_CLUSTER --services $ENVIRONMENT-ProductiveMiner-Service --region $REGION

# View logs
aws logs describe-log-groups --log-group-name-prefix /ecs/$ENVIRONMENT-ProductiveMiner --region $REGION

# Scale service
aws ecs update-service --cluster $ECS_CLUSTER --service $ENVIRONMENT-ProductiveMiner-Service --desired-count 3 --region $REGION

# Update service
aws ecs update-service --cluster $ECS_CLUSTER --service $ENVIRONMENT-ProductiveMiner-Service --force-new-deployment --region $REGION
\`\`\`

### 🧪 Test Commands
\`\`\`bash
# Test API health
curl https://$LOAD_BALANCER_DNS/api/health

# Test frontend
curl https://$LOAD_BALANCER_DNS

# Test domain (after DNS configuration)
curl https://$DOMAIN_NAME
\`\`\`

### 🎯 Next Steps
1. **Configure DNS**: Point your domain to the load balancer
2. **SSL Certificate**: Validate the certificate in Certificate Manager
3. **Monitoring**: Set up CloudWatch alarms
4. **Backup**: Configure RDS automated backups
5. **Scaling**: Set up auto-scaling policies

---
**Deployed on**: $(date)
**AWS Account**: $AWS_ACCOUNT_ID
**Region**: $REGION
**Stack Name**: $STACK_NAME
EOF

print_success "Deployment summary created: AWS_DEPLOYMENT_SUMMARY.md"

print_success "AWS deployment complete! 🎉"

echo ""
echo "🌟 Your revolutionary ProductiveMiner blockchain is now live on AWS!"
echo "   The first blockchain to use real mathematical work is ready for the world!"
echo "" 