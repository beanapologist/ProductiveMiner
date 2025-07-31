#!/bin/bash

# ECR Credentials Helper
# This script provides the current ECR credentials for manual login

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

print_status "Getting ECR credentials for manual login..."
echo ""

# Get the current ECR password
ECR_PASSWORD=$(aws ecr get-login-password --region $REGION)

if [ $? -eq 0 ]; then
    print_success "ECR Credentials Generated Successfully!"
    echo ""
    echo "🔐 Use these credentials for manual ECR login:"
    echo ""
    echo "Username: AWS"
    echo "Password: $ECR_PASSWORD"
    echo ""
    echo "⚠️  Important Notes:"
    echo "   - These credentials expire in 12 hours"
    echo "   - Run this script again if login fails"
    echo "   - Use these in Docker Desktop, web interfaces, etc."
    echo ""
    echo "🌐 ECR Registry URL:"
    echo "   $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com"
    echo ""
    echo "📋 Copy-paste ready:"
    echo "   Username: AWS"
    echo "   Password: $ECR_PASSWORD"
else
    print_error "Failed to get ECR credentials"
    echo ""
    echo "Please check your AWS credentials:"
    echo "   aws configure list"
    echo "   aws sts get-caller-identity"
fi 