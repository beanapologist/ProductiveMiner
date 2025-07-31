#!/bin/bash

# ProductiveMiner Minimal AWS Deployment Script
# This script deploys the application using existing VPC resources

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
STACK_NAME="ProductiveMiner-Minimal"
REGION="us-east-1"
ENVIRONMENT="production"

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

print_status "🚀 Deploying ProductiveMiner Minimal Setup to AWS..."
echo "=========================================================="

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
print_success "AWS Account ID: $AWS_ACCOUNT_ID"

# Step 1: Use existing VPC or create minimal one
print_status "Setting up VPC and networking..."

# Get existing VPC
EXISTING_VPC=$(aws ec2 describe-vpcs --query 'Vpcs[?State==`available`].VpcId' --output text | head -1 | awk '{print $1}')

if [ -z "$EXISTING_VPC" ]; then
    print_error "No available VPC found. Please create a VPC manually first."
    exit 1
fi

print_success "Using existing VPC: $EXISTING_VPC"

# Step 2: Create ECR repositories
print_status "Creating ECR repositories..."

aws ecr create-repository --repository-name productiveminer-app --region $REGION 2>/dev/null || print_warning "Repository productiveminer-app already exists"
aws ecr create-repository --repository-name productiveminer-frontend --region $REGION 2>/dev/null || print_warning "Repository productiveminer-frontend already exists"

print_success "ECR repositories created"

# Step 3: Login to ECR
print_status "Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

print_success "Logged in to ECR"

# Step 4: Tag and push Docker images
print_status "Tagging and pushing Docker images..."

# Tag images
docker tag testnet-adaptive-app:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker tag testnet-adaptive-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest

# Push images
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest

print_success "Docker images pushed to ECR"

# Step 5: Create ECS Cluster
print_status "Creating ECS Cluster..."
aws ecs create-cluster --cluster-name ProductiveMiner-Cluster --region $REGION 2>/dev/null || print_warning "ECS Cluster already exists"

print_success "ECS Cluster created"

# Step 6: Create Task Execution Role
print_status "Creating Task Execution Role..."

# Create the role
aws iam create-role --role-name ProductiveMiner-ECS-Task-Execution-Role --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}' 2>/dev/null || print_warning "Role already exists"

# Attach the policy
aws iam attach-role-policy --role-name ProductiveMiner-ECS-Task-Execution-Role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

print_success "Task Execution Role created"

# Step 7: Create CloudWatch Log Group
print_status "Creating CloudWatch Log Group..."
aws logs create-log-group --log-group-name /ecs/ProductiveMiner --region $REGION 2>/dev/null || print_warning "Log group already exists"

print_success "CloudWatch Log Group created"

# Step 8: Create Security Group
print_status "Creating Security Group..."

# Delete existing security group if it exists in wrong VPC
EXISTING_SG=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=ProductiveMiner-SG" \
    --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "")

if [ ! -z "$EXISTING_SG" ] && [ "$EXISTING_SG" != "None" ]; then
    SG_VPC=$(aws ec2 describe-security-groups \
        --group-ids $EXISTING_SG \
        --query 'SecurityGroups[0].VpcId' --output text)
    
    if [ "$SG_VPC" != "$EXISTING_VPC" ]; then
        print_warning "Deleting existing security group in wrong VPC..."
        aws ec2 delete-security-group --group-id $EXISTING_SG 2>/dev/null || true
        EXISTING_SG=""
    fi
fi

SECURITY_GROUP_ID=$(aws ec2 create-security-group \
    --group-name ProductiveMiner-SG \
    --description "ProductiveMiner Security Group" \
    --vpc-id $EXISTING_VPC \
    --query 'GroupId' --output text 2>/dev/null || \
    aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=ProductiveMiner-SG" "Name=vpc-id,Values=$EXISTING_VPC" \
    --query 'SecurityGroups[0].GroupId' --output text)

# Add inbound rules
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 2>/dev/null || print_warning "Port 80 rule already exists"

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 2>/dev/null || print_warning "Port 443 rule already exists"

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0 2>/dev/null || print_warning "Port 3000 rule already exists"

print_success "Security Group created: $SECURITY_GROUP_ID"

# Step 9: Get subnets
print_status "Getting subnets..."
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$EXISTING_VPC" --query 'Subnets[*].SubnetId' --output text | tr '\t' ' ' | tr ' ' ',' | sed 's/,$//')

if [ -z "$SUBNET_IDS" ]; then
    print_error "No subnets found in VPC $EXISTING_VPC"
    exit 1
fi

print_success "Using subnets: $SUBNET_IDS"

# Step 10: Create Task Definition
print_status "Creating Task Definition..."

TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
    --family ProductiveMiner \
    --network-mode awsvpc \
    --requires-compatibilities FARGATE \
    --cpu 1024 \
    --memory 2048 \
    --execution-role-arn arn:aws:iam::$AWS_ACCOUNT_ID:role/ProductiveMiner-ECS-Task-Execution-Role \
    --container-definitions '[
      {
        "name": "adaptive-app",
        "image": "'$AWS_ACCOUNT_ID'.dkr.ecr.'$REGION'.amazonaws.com/productiveminer-app:latest",
        "portMappings": [
          {
            "containerPort": 3000,
            "protocol": "tcp"
          }
        ],
        "environment": [
          {
            "name": "NODE_ENV",
            "value": "production"
          }
        ],
        "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "/ecs/ProductiveMiner",
            "awslogs-region": "'$REGION'",
            "awslogs-stream-prefix": "ecs"
          }
        }
      },
      {
        "name": "adaptive-frontend",
        "image": "'$AWS_ACCOUNT_ID'.dkr.ecr.'$REGION'.amazonaws.com/productiveminer-frontend:latest",
        "portMappings": [
          {
            "containerPort": 80,
            "protocol": "tcp"
          }
        ],
        "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "/ecs/ProductiveMiner",
            "awslogs-region": "'$REGION'",
            "awslogs-stream-prefix": "ecs"
          }
        }
      }
    ]' \
    --query 'taskDefinition.taskDefinitionArn' --output text)

print_success "Task Definition created: $TASK_DEFINITION_ARN"

# Step 11: Create or Update ECS Service
print_status "Creating/Updating ECS Service..."

# Check if service already exists
SERVICE_STATUS=$(aws ecs describe-services \
    --cluster ProductiveMiner-Cluster \
    --services ProductiveMiner-Service \
    --region $REGION \
    --query 'services[0].status' --output text 2>/dev/null || echo "NONEXISTENT")

if [ "$SERVICE_STATUS" = "ACTIVE" ]; then
    print_warning "Service already exists. Updating with new task definition..."
    SERVICE_ARN=$(aws ecs update-service \
        --cluster ProductiveMiner-Cluster \
        --service ProductiveMiner-Service \
        --task-definition $TASK_DEFINITION_ARN \
        --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=ENABLED}" \
        --force-new-deployment \
        --region $REGION \
        --query 'service.serviceArn' --output text)
    print_success "ECS Service updated: $SERVICE_ARN"
else
    print_status "Creating new ECS Service..."
    SERVICE_ARN=$(aws ecs create-service \
        --cluster ProductiveMiner-Cluster \
        --service-name ProductiveMiner-Service \
        --task-definition $TASK_DEFINITION_ARN \
        --desired-count 1 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=ENABLED}" \
        --region $REGION \
        --query 'service.serviceArn' --output text)
    print_success "ECS Service created: $SERVICE_ARN"
fi

# Step 12: Wait for service to be stable
print_status "Waiting for ECS service to be stable..."
aws ecs wait services-stable \
    --cluster ProductiveMiner-Cluster \
    --services ProductiveMiner-Service \
    --region $REGION

print_success "ECS service is stable"

# Step 13: Get service details
print_status "Getting service details..."

SERVICE_DETAILS=$(aws ecs describe-services \
    --cluster ProductiveMiner-Cluster \
    --services ProductiveMiner-Service \
    --region $REGION)

TASK_ARN=$(echo "$SERVICE_DETAILS" | jq -r '.services[0].tasks[0].taskArn // empty')

if [ ! -z "$TASK_ARN" ]; then
    TASK_DETAILS=$(aws ecs describe-tasks \
        --cluster ProductiveMiner-Cluster \
        --tasks $TASK_ARN \
        --region $REGION)
    
    PUBLIC_IP=$(echo "$TASK_DETAILS" | jq -r '.tasks[0].attachments[0].details[] | select(.name=="publicIP").value // empty')
    
    if [ ! -z "$PUBLIC_IP" ]; then
        print_success "Application is running on: http://$PUBLIC_IP:3000"
        print_success "Frontend is running on: http://$PUBLIC_IP:80"
    else
        print_warning "Could not get public IP. Service may still be starting."
    fi
else
    print_warning "No tasks running yet. Service may still be starting."
fi

# Step 14: Display deployment information
echo ""
echo "🎉 ProductiveMiner Minimal AWS Deployment Complete!"
echo "=================================================="
echo ""
echo "🔧 Infrastructure Details:"
echo "   ECS Cluster: ProductiveMiner-Cluster"
echo "   ECS Service: ProductiveMiner-Service"
echo "   VPC ID: $EXISTING_VPC"
echo "   Security Group: $SECURITY_GROUP_ID"
echo "   Task Definition: $TASK_DEFINITION_ARN"
echo ""
echo "📊 Monitoring:"
echo "   CloudWatch Logs: /ecs/ProductiveMiner"
echo "   ECS Console: https://console.aws.amazon.com/ecs/home?region=$REGION#/clusters/ProductiveMiner-Cluster"
echo ""
echo "🧪 Test Commands:"
echo "   # Check service status"
echo "   aws ecs describe-services --cluster ProductiveMiner-Cluster --services ProductiveMiner-Service --region $REGION"
echo ""
echo "   # View logs"
echo "   aws logs describe-log-groups --log-group-name-prefix /ecs/ProductiveMiner --region $REGION"
echo ""
echo "   # Scale service"
echo "   aws ecs update-service --cluster ProductiveMiner-Cluster --service ProductiveMiner-Service --desired-count 2 --region $REGION"
echo ""
echo "🛑 Cleanup Commands:"
echo "   # Delete service"
echo "   aws ecs update-service --cluster ProductiveMiner-Cluster --service ProductiveMiner-Service --desired-count 0 --region $REGION"
echo "   aws ecs delete-service --cluster ProductiveMiner-Cluster --service ProductiveMiner-Service --region $REGION"
echo ""

print_success "Minimal AWS deployment complete! 🎉"

echo ""
echo "🌟 Your revolutionary ProductiveMiner blockchain is now running on AWS!"
echo "   The first blockchain to use real mathematical work is ready for the world!"
echo "" 