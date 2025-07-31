#!/bin/bash

# ProductiveMiner AWS Cleanup Script
# This script cleans up old ProductiveMiner VPCs and resources

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

REGION="us-east-1"

print_status "🧹 Cleaning up old ProductiveMiner deployments..."

# Get all ProductiveMiner VPCs
VPC_IDS=$(aws ec2 describe-vpcs \
    --filters "Name=tag:Name,Values=ProductiveMiner-VPC" \
    --query 'Vpcs[?State==`available`].VpcId' \
    --output text)

if [ -z "$VPC_IDS" ]; then
    print_warning "No ProductiveMiner VPCs found to clean up"
    exit 0
fi

print_status "Found VPCs: $VPC_IDS"

for VPC_ID in $VPC_IDS; do
    print_status "Cleaning up VPC: $VPC_ID"
    
    # Get subnets in this VPC
    SUBNET_IDS=$(aws ec2 describe-subnets \
        --filters "Name=vpc-id,Values=$VPC_ID" \
        --query 'Subnets[].SubnetId' \
        --output text)
    
    if [ ! -z "$SUBNET_IDS" ]; then
        print_status "Deleting subnets: $SUBNET_IDS"
        for SUBNET_ID in $SUBNET_IDS; do
            aws ec2 delete-subnet --subnet-id $SUBNET_ID --region $REGION 2>/dev/null || print_warning "Could not delete subnet $SUBNET_ID"
        done
    fi
    
    # Get route tables in this VPC
    ROUTE_TABLE_IDS=$(aws ec2 describe-route-tables \
        --filters "Name=vpc-id,Values=$VPC_ID" \
        --query 'RouteTables[?Associations[0].Main!=`true`].RouteTableId' \
        --output text)
    
    if [ ! -z "$ROUTE_TABLE_IDS" ]; then
        print_status "Deleting route tables: $ROUTE_TABLE_IDS"
        for ROUTE_TABLE_ID in $ROUTE_TABLE_IDS; do
            aws ec2 delete-route-table --route-table-id $ROUTE_TABLE_ID --region $REGION 2>/dev/null || print_warning "Could not delete route table $ROUTE_TABLE_ID"
        done
    fi
    
    # Get internet gateways attached to this VPC
    IGW_IDS=$(aws ec2 describe-internet-gateways \
        --filters "Name=attachment.vpc-id,Values=$VPC_ID" \
        --query 'InternetGateways[].InternetGatewayId' \
        --output text)
    
    if [ ! -z "$IGW_IDS" ]; then
        print_status "Detaching and deleting internet gateways: $IGW_IDS"
        for IGW_ID in $IGW_IDS; do
            aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region $REGION 2>/dev/null || print_warning "Could not detach IGW $IGW_ID"
            aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID --region $REGION 2>/dev/null || print_warning "Could not delete IGW $IGW_ID"
        done
    fi
    
    # Delete the VPC
    print_status "Deleting VPC: $VPC_ID"
    aws ec2 delete-vpc --vpc-id $VPC_ID --region $REGION 2>/dev/null || print_warning "Could not delete VPC $VPC_ID"
    
    print_success "Cleaned up VPC: $VPC_ID"
done

# Clean up any orphaned internet gateways
print_status "Cleaning up orphaned internet gateways..."
ORPHANED_IGW_IDS=$(aws ec2 describe-internet-gateways \
    --filters "Name=attachment.state,Values=available" \
    --query 'InternetGateways[?Attachments[0].VpcId==null].InternetGatewayId' \
    --output text)

if [ ! -z "$ORPHANED_IGW_IDS" ]; then
    for IGW_ID in $ORPHANED_IGW_IDS; do
        print_status "Deleting orphaned IGW: $IGW_ID"
        aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID --region $REGION 2>/dev/null || print_warning "Could not delete orphaned IGW $IGW_ID"
    done
fi

print_success "🧹 Cleanup completed!"
print_status "You can now run the deployment script again." 