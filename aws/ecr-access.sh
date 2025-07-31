#!/bin/bash

# ECR Access Helper Script
# This script helps you easily access and manage your ECR repositories

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
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [REPOSITORY]"
    echo ""
    echo "Commands:"
    echo "  login      - Login to ECR"
    echo "  list       - List all repositories"
    echo "  images     - List images in repository"
    echo "  pull       - Pull latest image from repository"
    echo "  push       - Push image to repository"
    echo "  run        - Run image locally"
    echo "  web        - Open ECR in AWS Console"
    echo "  help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 login"
    echo "  $0 list"
    echo "  $0 images productiveminer-app"
    echo "  $0 pull productiveminer-app"
    echo "  $0 run productiveminer-app"
    echo "  $0 web"
}

# Function to login to ECR
login_ecr() {
    print_status "Logging in to ECR..."
    
    aws ecr get-login-password --region $REGION | \
    docker login --username AWS --password-stdin $ECR_URI
    
    if [ $? -eq 0 ]; then
        print_success "Successfully logged in to ECR"
        echo ""
        echo "🌐 ECR URI: $ECR_URI"
        echo "📦 You can now pull/push images"
    else
        print_error "Failed to login to ECR"
        exit 1
    fi
}

# Function to list repositories
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

# Function to list images in repository
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

# Function to pull image
pull_image() {
    REPOSITORY_NAME="${1:-productiveminer-app}"
    TAG="${2:-latest}"
    
    print_status "Pulling image: $REPOSITORY_NAME:$TAG"
    
    FULL_IMAGE_URI="$ECR_URI/$REPOSITORY_NAME:$TAG"
    
    echo "Pulling: $FULL_IMAGE_URI"
    
    docker pull $FULL_IMAGE_URI
    
    if [ $? -eq 0 ]; then
        print_success "Successfully pulled $FULL_IMAGE_URI"
        echo ""
        echo "📦 Image is now available locally"
        echo "🐳 Run with: docker run -p 3000:3000 $FULL_IMAGE_URI"
    else
        print_error "Failed to pull image"
    fi
}

# Function to push image
push_image() {
    REPOSITORY_NAME="${1:-productiveminer-app}"
    TAG="${2:-latest}"
    
    print_status "Pushing image to: $REPOSITORY_NAME:$TAG"
    
    # Check if local image exists
    if ! docker images | grep -q "$REPOSITORY_NAME.*$TAG"; then
        print_error "Local image $REPOSITORY_NAME:$TAG not found"
        echo ""
        echo "Available local images:"
        docker images | grep productiveminer || echo "No productiveminer images found locally"
        return 1
    fi
    
    # Tag the image for ECR
    FULL_IMAGE_URI="$ECR_URI/$REPOSITORY_NAME:$TAG"
    
    print_status "Tagging image for ECR..."
    docker tag $REPOSITORY_NAME:$TAG $FULL_IMAGE_URI
    
    print_status "Pushing to ECR..."
    docker push $FULL_IMAGE_URI
    
    if [ $? -eq 0 ]; then
        print_success "Successfully pushed $FULL_IMAGE_URI"
    else
        print_error "Failed to push image"
    fi
}

# Function to run image locally
run_image() {
    REPOSITORY_NAME="${1:-productiveminer-app}"
    TAG="${2:-latest}"
    
    print_status "Running image locally: $REPOSITORY_NAME:$TAG"
    
    FULL_IMAGE_URI="$ECR_URI/$REPOSITORY_NAME:$TAG"
    
    # Check if image exists locally, if not pull it
    if ! docker images | grep -q "$ECR_URI/$REPOSITORY_NAME.*$TAG"; then
        print_warning "Image not found locally, pulling from ECR..."
        docker pull $FULL_IMAGE_URI
    fi
    
    print_status "Starting container..."
    echo "🌐 Application will be available at: http://localhost:3000"
    echo "🛑 Press Ctrl+C to stop the container"
    echo ""
    
    docker run -p 3000:3000 $FULL_IMAGE_URI
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

# Function to show ECR information
show_ecr_info() {
    print_status "ECR Information"
    echo ""
    echo "🔧 Configuration:"
    echo "   AWS Account ID: $AWS_ACCOUNT_ID"
    echo "   Region: $REGION"
    echo "   ECR URI: $ECR_URI"
    echo ""
    echo "📦 Available Repositories:"
    aws ecr describe-repositories \
        --region $REGION \
        --query 'repositories[*].repositoryName' \
        --output table
    echo ""
    echo "🔐 Authentication Status:"
    if docker info | grep -q "$ECR_URI"; then
        print_success "Logged in to ECR"
    else
        print_warning "Not logged in to ECR"
        echo "Run: $0 login"
    fi
}

# Main script logic
case "${1:-help}" in
    login)
        login_ecr
        ;;
    list)
        list_repositories
        ;;
    images)
        list_images "$2"
        ;;
    pull)
        pull_image "$2" "$3"
        ;;
    push)
        push_image "$2" "$3"
        ;;
    run)
        run_image "$2" "$3"
        ;;
    web)
        open_web_console
        ;;
    info)
        show_ecr_info
        ;;
    help|*)
        show_usage
        echo ""
        show_ecr_info
        ;;
esac 