#!/bin/bash

# View Docker Images in AWS ECR
# This script helps you view and manage Docker images in AWS ECR

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
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  list       - List all ECR repositories"
    echo "  images     - List images in a specific repository"
    echo "  details    - Show detailed information about images"
    echo "  tags       - List all image tags"
    echo "  latest     - Show latest image details"
    echo "  size       - Show image sizes"
    echo "  web        - Open ECR in AWS Console"
    echo "  help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 images productiveminer-app"
    echo "  $0 details productiveminer-app"
    echo "  $0 latest productiveminer-app"
    echo "  $0 web"
}

# Function to list all ECR repositories
list_repositories() {
    print_status "Listing ECR repositories..."
    
    REPOSITORIES=$(aws ecr describe-repositories \
        --region $REGION \
        --query 'repositories[*].{Name:repositoryName,URI:repositoryUri,Created:createdAt}' \
        --output table)
    
    if [ $? -eq 0 ]; then
        echo "$REPOSITORIES"
    else
        print_error "Failed to list repositories"
    fi
}

# Function to list images in a repository
list_images() {
    REPOSITORY_NAME="${1:-productiveminer-app}"
    
    print_status "Listing images in repository: $REPOSITORY_NAME"
    
    IMAGES=$(aws ecr describe-images \
        --repository-name $REPOSITORY_NAME \
        --region $REGION \
        --query 'imageDetails[*].{Tag:imageTags[0],Digest:imageDigest,PushedAt:pushedAt,Size:imageSizeInBytes}' \
        --output table 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "$IMAGES"
    else
        print_error "Repository '$REPOSITORY_NAME' not found or no images"
        echo ""
        echo "Available repositories:"
        aws ecr describe-repositories \
            --region $REGION \
            --query 'repositories[*].repositoryName' \
            --output table
    fi
}

# Function to show detailed image information
show_image_details() {
    REPOSITORY_NAME="${1:-productiveminer-app}"
    
    print_status "Showing detailed information for repository: $REPOSITORY_NAME"
    
    DETAILS=$(aws ecr describe-images \
        --repository-name $REPOSITORY_NAME \
        --region $REGION \
        --query 'imageDetails[*]' \
        --output json 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "$DETAILS" | jq '.'
    else
        print_error "Repository '$REPOSITORY_NAME' not found"
    fi
}

# Function to list all image tags
list_tags() {
    REPOSITORY_NAME="${1:-productiveminer-app}"
    
    print_status "Listing all image tags for repository: $REPOSITORY_NAME"
    
    TAGS=$(aws ecr describe-images \
        --repository-name $REPOSITORY_NAME \
        --region $REGION \
        --query 'imageDetails[*].imageTags[]' \
        --output table 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "$TAGS"
    else
        print_error "Repository '$REPOSITORY_NAME' not found"
    fi
}

# Function to show latest image details
show_latest() {
    REPOSITORY_NAME="${1:-productiveminer-app}"
    
    print_status "Showing latest image details for repository: $REPOSITORY_NAME"
    
    LATEST=$(aws ecr describe-images \
        --repository-name $REPOSITORY_NAME \
        --region $REGION \
        --query 'imageDetails | sort_by(.pushedAt) | reverse | [0]' \
        --output json 2>/dev/null)
    
    if [ $? -eq 0 ] && [ "$LATEST" != "null" ]; then
        echo "$LATEST" | jq '.'
        
        # Extract useful information
        LATEST_TAG=$(echo "$LATEST" | jq -r '.imageTags[0] // "untagged"')
        LATEST_DIGEST=$(echo "$LATEST" | jq -r '.imageDigest')
        LATEST_SIZE=$(echo "$LATEST" | jq -r '.imageSizeInBytes')
        LATEST_PUSHED=$(echo "$LATEST" | jq -r '.pushedAt')
        
        echo ""
        echo "📊 Latest Image Summary:"
        echo "   Tag: $LATEST_TAG"
        echo "   Digest: $LATEST_DIGEST"
        echo "   Size: $(($LATEST_SIZE / 1024 / 1024)) MB"
        echo "   Pushed: $LATEST_PUSHED"
        echo "   Full URI: $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPOSITORY_NAME:$LATEST_TAG"
    else
        print_error "No images found in repository '$REPOSITORY_NAME'"
    fi
}

# Function to show image sizes
show_sizes() {
    REPOSITORY_NAME="${1:-productiveminer-app}"
    
    print_status "Showing image sizes for repository: $REPOSITORY_NAME"
    
    SIZES=$(aws ecr describe-images \
        --repository-name $REPOSITORY_NAME \
        --region $REGION \
        --query 'imageDetails[*].{Tag:imageTags[0],SizeMB:imageSizeInBytes}' \
        --output json 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "$SIZES" | jq -r '.[] | "\(.Tag // "untagged"): \((.SizeMB / 1024 / 1024) | round) MB"'
    else
        print_error "Repository '$REPOSITORY_NAME' not found"
    fi
}

# Function to open ECR in AWS Console
open_web_console() {
    print_status "Opening ECR in AWS Console..."
    
    CONSOLE_URL="https://console.aws.amazon.com/ecr/repositories?region=$REGION"
    
    print_success "Opening: $CONSOLE_URL"
    
    # Try to open the URL
    if command -v open &> /dev/null; then
        open "$CONSOLE_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$CONSOLE_URL"
    else
        echo "Please open this URL in your browser:"
        echo "$CONSOLE_URL"
    fi
}

# Function to show ECR login command
show_login_command() {
    print_status "ECR Login Information"
    echo ""
    echo "To login to ECR and pull images:"
    echo "aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
    echo ""
    echo "To pull a specific image:"
    echo "docker pull $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest"
    echo ""
    echo "To list local Docker images:"
    echo "docker images | grep productiveminer"
}

# Main script logic
case "${1:-help}" in
    list)
        list_repositories
        ;;
    images)
        list_images "$2"
        ;;
    details)
        show_image_details "$2"
        ;;
    tags)
        list_tags "$2"
        ;;
    latest)
        show_latest "$2"
        ;;
    size)
        show_sizes "$2"
        ;;
    web)
        open_web_console
        ;;
    login)
        show_login_command
        ;;
    help|*)
        show_usage
        echo ""
        show_login_command
        ;;
esac 