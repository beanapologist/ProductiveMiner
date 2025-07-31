#!/bin/bash

# ProductiveMiner Custom AWS Deployment Script
# This script works around AWS service limits by using existing resources

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

print_status "🚀 Deploying ProductiveMiner to AWS (Custom - Using Existing Resources)"
echo "=================================================================="

# Configuration
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
ENVIRONMENT="prod"
STACK_NAME="ProductiveMiner-Custom"

print_success "AWS Account ID: $AWS_ACCOUNT_ID"

# Step 1: Check prerequisites
print_status "Checking prerequisites..."

if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    exit 1
fi

print_success "Prerequisites check passed"

# Step 2: Get existing VPC and resources
print_status "Finding existing VPC and resources..."

# Use the default VPC (the one without a Name tag)
EXISTING_VPC=$(aws ec2 describe-vpcs --query 'Vpcs[?State==`available` && Tags[?Key==`Name`].Value|[0]==`null`][0].VpcId' --output text)

if [ "$EXISTING_VPC" = "None" ] || [ -z "$EXISTING_VPC" ]; then
    # Fallback to any available VPC
    EXISTING_VPC=$(aws ec2 describe-vpcs --query 'Vpcs[?State==`available`][0].VpcId' --output text)
fi

# If still empty, use the known default VPC
if [ "$EXISTING_VPC" = "None" ] || [ -z "$EXISTING_VPC" ]; then
    EXISTING_VPC="vpc-0d924889eab3fde42"
fi

# Debug output
echo "DEBUG: Found VPC: $EXISTING_VPC"

if [ "$EXISTING_VPC" = "None" ] || [ -z "$EXISTING_VPC" ]; then
    print_error "No available VPC found"
    exit 1
fi

# Get subnets from the VPC
EXISTING_SUBNET1=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$EXISTING_VPC" --query 'Subnets[0].SubnetId' --output text)
EXISTING_SUBNET2=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$EXISTING_VPC" --query 'Subnets[1].SubnetId' --output text)

print_success "Using existing VPC: $EXISTING_VPC"
print_success "Using subnets: $EXISTING_SUBNET1, $EXISTING_SUBNET2"

# Step 3: Create ECR repositories
print_status "Creating ECR repositories..."

aws ecr create-repository --repository-name productiveminer-app --region $REGION 2>/dev/null || print_warning "Repository productiveminer-app already exists"
aws ecr create-repository --repository-name productiveminer-frontend --region $REGION 2>/dev/null || print_warning "Repository productiveminer-frontend already exists"

print_success "ECR repositories created"

# Step 4: Login to ECR
print_status "Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

print_success "Logged in to ECR"

# Step 5: Tag and push Docker images
print_status "Tagging and pushing Docker images..."

# Tag images
docker tag testnet-adaptive-app:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker tag testnet-adaptive-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest

# Push images
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-frontend:latest

print_success "Docker images pushed to ECR"

# Step 6: Create or get security group
print_status "Creating or getting security group..."

# Try to create security group, if it exists, get its ID
SECURITY_GROUP_ID=$(aws ec2 create-security-group \
    --group-name ProductiveMiner-SG-Custom \
    --description "ProductiveMiner Security Group" \
    --vpc-id $EXISTING_VPC \
    --query 'GroupId' --output text 2>/dev/null || \
    aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=ProductiveMiner-SG-Custom" "Name=vpc-id,Values=$EXISTING_VPC" \
    --query 'SecurityGroups[0].GroupId' --output text)

# Add rules (ignore if they already exist)
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 2>/dev/null || true

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 2>/dev/null || true

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0 2>/dev/null || true

print_success "Security group ready: $SECURITY_GROUP_ID"

# Step 7: Create ECS cluster
print_status "Creating ECS cluster..."

aws ecs create-cluster --cluster-name ProductiveMiner-Cluster-Custom --region $REGION 2>/dev/null || print_warning "Cluster already exists"

print_success "ECS cluster created"

# Step 8: Create IAM role for ECS
print_status "Creating IAM role for ECS..."

# Create the ECS task execution role
aws iam create-role \
    --role-name ProductiveMiner-ECS-Task-Execution-Role \
    --assume-role-policy-document '{
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

# Attach the required policy
aws iam attach-role-policy \
    --role-name ProductiveMiner-ECS-Task-Execution-Role \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || print_warning "Policy already attached"

print_success "IAM role created"

# Step 9: Create task definition
print_status "Creating ECS task definition..."

cat > task-definition.json << EOF
{
  "family": "ProductiveMiner-Custom",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::$AWS_ACCOUNT_ID:role/ProductiveMiner-ECS-Task-Execution-Role",
  "containerDefinitions": [
    {
      "name": "productiveminer-app",
      "image": "$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest",
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
          "awslogs-group": "/ecs/ProductiveMiner-Custom",
          "awslogs-region": "$REGION",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
    --cli-input-json file://task-definition.json \
    --query 'taskDefinition.taskDefinitionArn' --output text)

print_success "Task definition created: $TASK_DEFINITION_ARN"

# Step 10: Create CloudWatch log group
print_status "Creating CloudWatch log group..."

aws logs create-log-group --log-group-name /ecs/ProductiveMiner-Custom --region $REGION 2>/dev/null || print_warning "Log group already exists"

print_success "CloudWatch log group created"

# Step 11: Create ECS service
print_status "Creating ECS service..."

SERVICE_ARN=$(aws ecs create-service \
    --cluster ProductiveMiner-Cluster-Custom \
    --service-name ProductiveMiner-Service-Custom \
    --task-definition $TASK_DEFINITION_ARN \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$EXISTING_SUBNET1,$EXISTING_SUBNET2],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=ENABLED}" \
    --region $REGION \
    --query 'service.serviceArn' --output text)

print_success "ECS service created: $SERVICE_ARN"

# Step 12: Wait for service to be stable
print_status "Waiting for ECS service to be stable..."
aws ecs wait services-stable \
    --cluster ProductiveMiner-Cluster-Custom \
    --services ProductiveMiner-Service-Custom \
    --region $REGION

print_success "ECS service is stable"

# Step 13: Get service details
print_status "Getting service details..."

SERVICE_DETAILS=$(aws ecs describe-services \
    --cluster ProductiveMiner-Cluster-Custom \
    --services ProductiveMiner-Service-Custom \
    --region $REGION)

TASK_ARN=$(echo "$SERVICE_DETAILS" | jq -r '.services[0].tasks[0].taskArn // empty')

if [ ! -z "$TASK_ARN" ]; then
    TASK_DETAILS=$(aws ecs describe-tasks \
        --cluster ProductiveMiner-Cluster-Custom \
        --tasks $TASK_ARN \
        --region $REGION)
    
    PUBLIC_IP=$(echo "$TASK_DETAILS" | jq -r '.tasks[0].attachments[0].details[] | select(.name=="publicIp").value // empty')
    
    if [ ! -z "$PUBLIC_IP" ]; then
        print_success "Application deployed successfully!"
        echo ""
        echo "🎉 ProductiveMiner Custom AWS Deployment Complete!"
        echo "================================================"
        echo ""
        echo "🌐 Access Information:"
        echo "   Public IP: $PUBLIC_IP"
        echo "   API Endpoint: http://$PUBLIC_IP:3000"
        echo "   Health Check: http://$PUBLIC_IP:3000/health"
        echo ""
        echo "🔧 Infrastructure Details:"
        echo "   VPC ID: $EXISTING_VPC"
        echo "   Security Group: $SECURITY_GROUP_ID"
        echo "   ECS Cluster: ProductiveMiner-Cluster-Custom"
        echo "   ECS Service: ProductiveMiner-Service-Custom"
        echo ""
        echo "📊 Management Commands:"
        echo "   # View service status"
        echo "   aws ecs describe-services --cluster ProductiveMiner-Cluster-Custom --services ProductiveMiner-Service-Custom --region $REGION"
        echo ""
        echo "   # View logs"
        echo "   aws logs describe-log-groups --log-group-name-prefix /ecs/ProductiveMiner-Custom --region $REGION"
        echo ""
        echo "   # Scale service"
        echo "   aws ecs update-service --cluster ProductiveMiner-Cluster-Custom --service ProductiveMiner-Service-Custom --desired-count 2 --region $REGION"
        echo ""
        echo "🧪 Test Commands:"
        echo "   curl http://$PUBLIC_IP:3000/health"
        echo "   curl http://$PUBLIC_IP:3000/api/status"
        echo ""
    else
        print_warning "Service created but public IP not available yet. Please wait a few minutes and check the ECS console."
    fi
else
    print_warning "Service created but no tasks running yet. Please wait a few minutes and check the ECS console."
fi

# Clean up temporary files
rm -f task-definition.json

print_success "Deployment script completed!" 