#!/bin/bash

# Manage Elastic IP for ProductiveMiner-Service-Custom
# This script provides utilities to manage the Elastic IP

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
REGION="us-east-1"
CLUSTER_NAME="ProductiveMiner-Cluster-Custom"
SERVICE_NAME="ProductiveMiner-Service-Custom"
NLB_NAME="ProductiveMiner-NLB-Custom"

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  status     - Show current Elastic IP status"
    echo "  info       - Show detailed Elastic IP information"
    echo "  test       - Test connectivity to Elastic IP"
    echo "  release    - Release the Elastic IP (WARNING: This will remove the IP)"
    echo "  reassign   - Reassign a new Elastic IP to the service"
    echo "  help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 test"
    echo "  $0 release"
}

# Function to get Elastic IP information
get_elastic_ip_info() {
    # Try to find the Elastic IP associated with our NLB
    NLB_ARN=$(aws elbv2 describe-load-balancers \
        --names $NLB_NAME \
        --region $REGION \
        --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null || echo "NOT_FOUND")
    
    if [ "$NLB_ARN" = "NOT_FOUND" ]; then
        echo "NOT_FOUND"
        return
    fi
    
    # Get the network interface of the NLB
    NLB_NETWORK_INTERFACE=$(aws elbv2 describe-load-balancers \
        --load-balancer-arns $NLB_ARN \
        --region $REGION \
        --query 'LoadBalancers[0].AvailabilityZones[0].LoadBalancerAddresses[0].NetworkInterfaceId' --output text 2>/dev/null || echo "NOT_FOUND")
    
    if [ "$NLB_NETWORK_INTERFACE" = "NOT_FOUND" ]; then
        echo "NOT_FOUND"
        return
    fi
    
    # Find the Elastic IP associated with this network interface
    ELASTIC_IP_INFO=$(aws ec2 describe-addresses \
        --filters "Name=network-interface-id,Values=$NLB_NETWORK_INTERFACE" \
        --region $REGION \
        --query 'Addresses[0]' --output json 2>/dev/null || echo "NOT_FOUND")
    
    echo "$ELASTIC_IP_INFO"
}

# Function to show status
show_status() {
    print_status "Checking Elastic IP status..."
    
    ELASTIC_IP_INFO=$(get_elastic_ip_info)
    
    if [ "$ELASTIC_IP_INFO" = "NOT_FOUND" ]; then
        print_warning "No Elastic IP found for ProductiveMiner-Service-Custom"
        echo ""
        echo "This could mean:"
        echo "  - The service hasn't been deployed with Elastic IP yet"
        echo "  - The Network Load Balancer doesn't exist"
        echo "  - The Elastic IP was released"
        echo ""
        echo "To deploy with Elastic IP, run:"
        echo "  ./aws/deploy-with-elastic-ip.sh"
        return
    fi
    
    ELASTIC_IP=$(echo "$ELASTIC_IP_INFO" | jq -r '.PublicIp // empty')
    ELASTIC_IP_ID=$(echo "$ELASTIC_IP_INFO" | jq -r '.AllocationId // empty')
    
    if [ ! -z "$ELASTIC_IP" ] && [ "$ELASTIC_IP" != "null" ]; then
        print_success "Elastic IP found: $ELASTIC_IP"
        echo ""
        echo "🌐 Access Information:"
        echo "   Elastic IP: $ELASTIC_IP"
        echo "   HTTP Endpoint: http://$ELASTIC_IP"
        echo "   Health Check: http://$ELASTIC_IP/health"
        echo "   API Endpoint: http://$ELASTIC_IP/api"
        echo ""
        echo "🔧 Infrastructure Details:"
        echo "   Elastic IP ID: $ELASTIC_IP_ID"
        echo "   Network Load Balancer: $NLB_NAME"
        echo "   ECS Cluster: $CLUSTER_NAME"
        echo "   ECS Service: $SERVICE_NAME"
    else
        print_warning "Elastic IP information incomplete"
    fi
}

# Function to show detailed information
show_info() {
    print_status "Getting detailed Elastic IP information..."
    
    ELASTIC_IP_INFO=$(get_elastic_ip_info)
    
    if [ "$ELASTIC_IP_INFO" = "NOT_FOUND" ]; then
        print_warning "No Elastic IP found"
        return
    fi
    
    echo "$ELASTIC_IP_INFO" | jq '.'
}

# Function to test connectivity
test_connectivity() {
    print_status "Testing Elastic IP connectivity..."
    
    ELASTIC_IP_INFO=$(get_elastic_ip_info)
    
    if [ "$ELASTIC_IP_INFO" = "NOT_FOUND" ]; then
        print_warning "No Elastic IP found"
        return
    fi
    
    ELASTIC_IP=$(echo "$ELASTIC_IP_INFO" | jq -r '.PublicIp // empty')
    
    if [ -z "$ELASTIC_IP" ] || [ "$ELASTIC_IP" = "null" ]; then
        print_warning "Elastic IP not found"
        return
    fi
    
    print_status "Testing HTTP connectivity to $ELASTIC_IP..."
    
    # Test basic HTTP connectivity
    if curl -s -f --connect-timeout 10 http://$ELASTIC_IP:80/health > /dev/null 2>&1; then
        print_success "✅ HTTP connectivity successful"
    else
        print_warning "⚠️  HTTP connectivity failed"
    fi
    
    # Test API endpoint
    if curl -s -f --connect-timeout 10 http://$ELASTIC_IP:80/api/status > /dev/null 2>&1; then
        print_success "✅ API endpoint responding"
    else
        print_warning "⚠️  API endpoint not responding"
    fi
    
    # Test with curl verbose for more details
    print_status "Detailed connectivity test..."
    curl -v --connect-timeout 10 http://$ELASTIC_IP:80/health 2>&1 | head -20
}

# Function to release Elastic IP
release_elastic_ip() {
    print_warning "⚠️  WARNING: This will release the Elastic IP permanently!"
    echo "This action cannot be undone and will make your service inaccessible via the current IP."
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        print_status "Operation cancelled"
        return
    fi
    
    print_status "Releasing Elastic IP..."
    
    ELASTIC_IP_INFO=$(get_elastic_ip_info)
    
    if [ "$ELASTIC_IP_INFO" = "NOT_FOUND" ]; then
        print_warning "No Elastic IP found to release"
        return
    fi
    
    ELASTIC_IP_ID=$(echo "$ELASTIC_IP_INFO" | jq -r '.AllocationId // empty')
    ELASTIC_IP=$(echo "$ELASTIC_IP_INFO" | jq -r '.PublicIp // empty')
    
    if [ -z "$ELASTIC_IP_ID" ] || [ "$ELASTIC_IP_ID" = "null" ]; then
        print_warning "No Elastic IP ID found"
        return
    fi
    
    # Release the Elastic IP
    aws ec2 release-address \
        --allocation-id $ELASTIC_IP_ID \
        --region $REGION
    
    print_success "Elastic IP $ELASTIC_IP released successfully"
    echo ""
    echo "⚠️  Important:"
    echo "   - Your service is no longer accessible via $ELASTIC_IP"
    echo "   - To restore access, you need to reassign a new Elastic IP"
    echo "   - Run: $0 reassign"
}

# Function to reassign Elastic IP
reassign_elastic_ip() {
    print_status "Reassigning new Elastic IP..."
    
    # Check if service exists
    SERVICE_STATUS=$(aws ecs describe-services \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME \
        --region $REGION \
        --query 'services[0].status' --output text 2>/dev/null || echo "SERVICE_NOT_FOUND")
    
    if [ "$SERVICE_STATUS" = "SERVICE_NOT_FOUND" ]; then
        print_error "ECS service $SERVICE_NAME not found"
        echo "Please deploy the service first using: ./aws/deploy-with-elastic-ip.sh"
        return
    fi
    
    # Allocate new Elastic IP
    NEW_ELASTIC_IP_ID=$(aws ec2 allocate-address \
        --domain vpc \
        --region $REGION \
        --query 'AllocationId' --output text)
    
    NEW_ELASTIC_IP=$(aws ec2 describe-addresses \
        --allocation-ids $NEW_ELASTIC_IP_ID \
        --query 'Addresses[0].PublicIp' --output text)
    
    print_success "New Elastic IP allocated: $NEW_ELASTIC_IP"
    
    # Get NLB ARN
    NLB_ARN=$(aws elbv2 describe-load-balancers \
        --names $NLB_NAME \
        --region $REGION \
        --query 'LoadBalancers[0].LoadBalancerArn' --output text)
    
    # Get the network interface of the NLB
    NLB_NETWORK_INTERFACE=$(aws elbv2 describe-load-balancers \
        --load-balancer-arns $NLB_ARN \
        --region $REGION \
        --query 'LoadBalancers[0].AvailabilityZones[0].LoadBalancerAddresses[0].NetworkInterfaceId' --output text)
    
    # Associate the new Elastic IP with the NLB's network interface
    aws ec2 associate-address \
        --allocation-id $NEW_ELASTIC_IP_ID \
        --network-interface-id $NLB_NETWORK_INTERFACE \
        --region $REGION
    
    print_success "New Elastic IP associated with Network Load Balancer"
    
    echo ""
    echo "🎉 New Elastic IP assigned successfully!"
    echo "======================================"
    echo ""
    echo "🌐 New Access Information:"
    echo "   Elastic IP: $NEW_ELASTIC_IP"
    echo "   HTTP Endpoint: http://$NEW_ELASTIC_IP"
    echo "   Health Check: http://$NEW_ELASTIC_IP/health"
    echo "   API Endpoint: http://$NEW_ELASTIC_IP/api"
    echo ""
    echo "🧪 Test the new IP:"
    echo "   curl http://$NEW_ELASTIC_IP/health"
    echo "   curl http://$NEW_ELASTIC_IP/api/status"
}

# Main script logic
case "${1:-help}" in
    status)
        show_status
        ;;
    info)
        show_info
        ;;
    test)
        test_connectivity
        ;;
    release)
        release_elastic_ip
        ;;
    reassign)
        reassign_elastic_ip
        ;;
    help|*)
        show_usage
        ;;
esac 