#!/bin/bash

# Deploy ProductiveMiner-Service-Custom with Elastic IP
# This script creates the complete infrastructure with a permanent Elastic IP

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

print_status "🚀 Deploying ProductiveMiner with Elastic IP"
echo "=================================================="

# Configuration
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
CLUSTER_NAME="ProductiveMiner-Cluster-Custom"
SERVICE_NAME="ProductiveMiner-Service-Custom"
NLB_NAME="ProductiveMiner-NLB-Custom"
TARGET_GROUP_NAME="ProductiveMiner-TG-Custom"

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

aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $REGION 2>/dev/null || print_warning "Cluster already exists"

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

# Step 9: Allocate Elastic IP
print_status "Allocating Elastic IP..."

ELASTIC_IP_ID=$(aws ec2 allocate-address \
    --domain vpc \
    --region $REGION \
    --query 'AllocationId' --output text)

ELASTIC_IP=$(aws ec2 describe-addresses \
    --allocation-ids $ELASTIC_IP_ID \
    --query 'Addresses[0].PublicIp' --output text)

print_success "Elastic IP allocated: $ELASTIC_IP (ID: $ELASTIC_IP_ID)"

# Step 10: Create Target Group
print_status "Creating target group..."

TARGET_GROUP_ARN=$(aws elbv2 create-target-group \
    --name $TARGET_GROUP_NAME \
    --protocol TCP \
    --port 3000 \
    --vpc-id $EXISTING_VPC \
    --target-type ip \
    --region $REGION \
    --query 'TargetGroups[0].TargetGroupArn' --output text)

print_success "Target group created: $TARGET_GROUP_ARN"

# Step 11: Create Network Load Balancer
print_status "Creating Network Load Balancer..."

NLB_ARN=$(aws elbv2 create-load-balancer \
    --name $NLB_NAME \
    --subnets $EXISTING_SUBNET1 $EXISTING_SUBNET2 \
    --scheme internet-facing \
    --type network \
    --region $REGION \
    --query 'LoadBalancers[0].LoadBalancerArn' --output text)

print_success "Network Load Balancer created: $NLB_ARN"

# Step 12: Wait for NLB to be active
print_status "Waiting for Network Load Balancer to be active..."
aws elbv2 wait load-balancer-available \
    --load-balancer-arns $NLB_ARN \
    --region $REGION

print_success "Network Load Balancer is active"

# Step 13: Create listener
print_status "Creating listener..."

LISTENER_ARN=$(aws elbv2 create-listener \
    --load-balancer-arn $NLB_ARN \
    --protocol TCP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN \
    --region $REGION \
    --query 'Listeners[0].ListenerArn' --output text)

print_success "Listener created: $LISTENER_ARN"

# Step 14: Associate Elastic IP with NLB
print_status "Associating Elastic IP with Network Load Balancer..."

# Get the network interface of the NLB
NLB_NETWORK_INTERFACE=$(aws elbv2 describe-load-balancers \
    --load-balancer-arns $NLB_ARN \
    --query 'LoadBalancers[0].AvailabilityZones[0].LoadBalancerAddresses[0].NetworkInterfaceId' --output text)

# Associate the Elastic IP with the NLB's network interface
aws ec2 associate-address \
    --allocation-id $ELASTIC_IP_ID \
    --network-interface-id $NLB_NETWORK_INTERFACE \
    --region $REGION

print_success "Elastic IP associated with Network Load Balancer"

# Step 15: Create task definition
print_status "Creating ECS task definition..."

cat > task-definition-elastic-ip.json << EOF
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
    --cli-input-json file://task-definition-elastic-ip.json \
    --query 'taskDefinition.taskDefinitionArn' --output text)

print_success "Task definition created: $TASK_DEFINITION_ARN"

# Step 16: Create CloudWatch log group
print_status "Creating CloudWatch log group..."

aws logs create-log-group --log-group-name /ecs/ProductiveMiner-Custom --region $REGION 2>/dev/null || print_warning "Log group already exists"

print_success "CloudWatch log group created"

# Step 17: Create ECS service with NLB
print_status "Creating ECS service with Network Load Balancer..."

SERVICE_ARN=$(aws ecs create-service \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME \
    --task-definition $TASK_DEFINITION_ARN \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$EXISTING_SUBNET1,$EXISTING_SUBNET2],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=DISABLED}" \
    --load-balancers "targetGroupArn=$TARGET_GROUP_ARN,containerName=productiveminer-app,containerPort=3000" \
    --region $REGION \
    --query 'service.serviceArn' --output text)

print_success "ECS service created: $SERVICE_ARN"

# Step 18: Wait for service to be stable
print_status "Waiting for ECS service to be stable..."
aws ecs wait services-stable \
    --cluster $CLUSTER_NAME \
    --services $SERVICE_NAME \
    --region $REGION

print_success "ECS service is stable"

# Step 19: Test the Elastic IP
print_status "Testing Elastic IP connection..."

# Wait a bit for the NLB to be fully ready
sleep 30

if curl -s -f http://$ELASTIC_IP:80/health > /dev/null 2>&1; then
    print_success "Application is responding on Elastic IP"
else
    print_warning "Application may not be ready yet. Please wait a few minutes and test manually."
fi

# Step 20: Display results
echo ""
echo "🎉 ProductiveMiner with Elastic IP Deployment Complete!"
echo "======================================================"
echo ""
echo "🌐 Access Information:"
echo "   Elastic IP: $ELASTIC_IP"
echo "   HTTP Endpoint: http://$ELASTIC_IP"
echo "   Health Check: http://$ELASTIC_IP/health"
echo "   API Endpoint: http://$ELASTIC_IP/api"
echo ""
echo "🔧 Infrastructure Details:"
echo "   Elastic IP ID: $ELASTIC_IP_ID"
echo "   Network Load Balancer: $NLB_ARN"
echo "   Target Group: $TARGET_GROUP_ARN"
echo "   VPC ID: $EXISTING_VPC"
echo "   Security Group: $SECURITY_GROUP_ID"
echo "   ECS Cluster: $CLUSTER_NAME"
echo "   ECS Service: $SERVICE_NAME"
echo ""
echo "📊 Management Commands:"
echo "   # View service status"
echo "   aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $REGION"
echo ""
echo "   # View NLB status"
echo "   aws elbv2 describe-load-balancers --load-balancer-arns $NLB_ARN --region $REGION"
echo ""
echo "   # View target group health"
echo "   aws elbv2 describe-target-health --target-group-arn $TARGET_GROUP_ARN --region $REGION"
echo ""
echo "   # Scale service"
echo "   aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --desired-count 2 --region $REGION"
echo ""
echo "🧪 Test Commands:"
echo "   curl http://$ELASTIC_IP/health"
echo "   curl http://$ELASTIC_IP/api/status"
echo ""
echo "⚠️  Important Notes:"
echo "   - The Elastic IP is now permanently assigned to your service"
echo "   - You will be charged for the Elastic IP even when not in use"
echo "   - To release the Elastic IP, use: aws ec2 release-address --allocation-id $ELASTIC_IP_ID"
echo ""

# Clean up temporary files
rm -f task-definition-elastic-ip.json

print_success "Deployment with Elastic IP completed!" 