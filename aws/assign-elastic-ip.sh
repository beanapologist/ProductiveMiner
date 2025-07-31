#!/bin/bash

# Assign Elastic IP to ProductiveMiner-Service-Custom Cluster
# This script creates a Network Load Balancer with Elastic IP and updates the ECS service

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

print_status "🚀 Assigning Elastic IP to ProductiveMiner-Service-Custom Cluster"
echo "=================================================================="

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

# Check if ECS service exists
SERVICE_STATUS=$(aws ecs describe-services \
    --cluster $CLUSTER_NAME \
    --services $SERVICE_NAME \
    --region $REGION \
    --query 'services[0].status' --output text 2>/dev/null || echo "SERVICE_NOT_FOUND")

if [ "$SERVICE_STATUS" = "SERVICE_NOT_FOUND" ]; then
    print_error "ECS service $SERVICE_NAME not found in cluster $CLUSTER_NAME"
    exit 1
fi

print_success "ECS service found and active"

# Step 2: Get existing VPC and subnets
print_status "Getting VPC and subnet information..."

# Get VPC from existing security group
SECURITY_GROUP_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=ProductiveMiner-SG-Custom" \
    --query 'SecurityGroups[0].GroupId' --output text)

VPC_ID=$(aws ec2 describe-security-groups \
    --group-ids $SECURITY_GROUP_ID \
    --query 'SecurityGroups[0].VpcId' --output text)

# Get subnets
SUBNET1=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0].SubnetId' --output text)
SUBNET2=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[1].SubnetId' --output text)

print_success "Using VPC: $VPC_ID"
print_success "Using subnets: $SUBNET1, $SUBNET2"

# Step 3: Allocate Elastic IP
print_status "Allocating Elastic IP..."

ELASTIC_IP_ID=$(aws ec2 allocate-address \
    --domain vpc \
    --region $REGION \
    --query 'AllocationId' --output text)

ELASTIC_IP=$(aws ec2 describe-addresses \
    --allocation-ids $ELASTIC_IP_ID \
    --query 'Addresses[0].PublicIp' --output text)

print_success "Elastic IP allocated: $ELASTIC_IP (ID: $ELASTIC_IP_ID)"

# Step 4: Create Target Group
print_status "Creating target group..."

TARGET_GROUP_ARN=$(aws elbv2 create-target-group \
    --name $TARGET_GROUP_NAME \
    --protocol TCP \
    --port 3000 \
    --vpc-id $VPC_ID \
    --target-type ip \
    --region $REGION \
    --query 'TargetGroups[0].TargetGroupArn' --output text)

print_success "Target group created: $TARGET_GROUP_ARN"

# Step 5: Create Network Load Balancer
print_status "Creating Network Load Balancer..."

NLB_ARN=$(aws elbv2 create-load-balancer \
    --name $NLB_NAME \
    --subnets $SUBNET1 $SUBNET2 \
    --scheme internet-facing \
    --type network \
    --region $REGION \
    --query 'LoadBalancers[0].LoadBalancerArn' --output text)

print_success "Network Load Balancer created: $NLB_ARN"

# Step 6: Wait for NLB to be active
print_status "Waiting for Network Load Balancer to be active..."
aws elbv2 wait load-balancer-available \
    --load-balancer-arns $NLB_ARN \
    --region $REGION

print_success "Network Load Balancer is active"

# Step 7: Create listener
print_status "Creating listener..."

LISTENER_ARN=$(aws elbv2 create-listener \
    --load-balancer-arn $NLB_ARN \
    --protocol TCP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN \
    --region $REGION \
    --query 'Listeners[0].ListenerArn' --output text)

print_success "Listener created: $LISTENER_ARN"

# Step 8: Associate Elastic IP with NLB
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

# Step 9: Update ECS service to use NLB
print_status "Updating ECS service to use Network Load Balancer..."

# Get current task definition
CURRENT_TASK_DEFINITION=$(aws ecs describe-services \
    --cluster $CLUSTER_NAME \
    --services $SERVICE_NAME \
    --region $REGION \
    --query 'services[0].taskDefinition' --output text)

# Create new task definition with NLB configuration
cat > task-definition-nlb.json << EOF
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

# Register new task definition
NEW_TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
    --cli-input-json file://task-definition-nlb.json \
    --query 'taskDefinition.taskDefinitionArn' --output text)

print_success "New task definition created: $NEW_TASK_DEFINITION_ARN"

# Update ECS service with NLB configuration
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --task-definition $NEW_TASK_DEFINITION_ARN \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET1,$SUBNET2],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=DISABLED}" \
    --load-balancers "targetGroupArn=$TARGET_GROUP_ARN,containerName=productiveminer-app,containerPort=3000" \
    --region $REGION

print_success "ECS service updated with Network Load Balancer configuration"

# Step 10: Wait for service to be stable
print_status "Waiting for ECS service to be stable..."
aws ecs wait services-stable \
    --cluster $CLUSTER_NAME \
    --services $SERVICE_NAME \
    --region $REGION

print_success "ECS service is stable"

# Step 11: Test the Elastic IP
print_status "Testing Elastic IP connection..."

# Wait a bit for the NLB to be fully ready
sleep 30

if curl -s -f http://$ELASTIC_IP:80/health > /dev/null 2>&1; then
    print_success "Application is responding on Elastic IP"
else
    print_warning "Application may not be ready yet. Please wait a few minutes and test manually."
fi

# Step 12: Display results
echo ""
echo "🎉 Elastic IP Assignment Complete!"
echo "================================="
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
rm -f task-definition-nlb.json

print_success "Elastic IP assignment completed!" 