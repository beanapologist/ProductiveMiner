#!/bin/bash

# ProductiveMiner Old Versions Cleanup Script
# This script cleans up old Docker images, containers, and ECR repositories

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

# Function to clean up local Docker images
cleanup_local_images() {
    print_status "Cleaning up local Docker images..."
    
    # Stop and remove containers using old images
    print_status "Stopping containers with old images..."
    docker ps -a --format "{{.Names}}" | grep -E "(productiveminer|testnet)" | xargs -r docker stop 2>/dev/null || true
    docker ps -a --format "{{.Names}}" | grep -E "(productiveminer|testnet)" | xargs -r docker rm 2>/dev/null || true
    
    # Remove old ProductiveMiner images
    print_status "Removing old ProductiveMiner images..."
    docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "(productiveminer|testnet)" | xargs -r docker rmi 2>/dev/null || true
    
    # Remove dangling images
    print_status "Removing dangling images..."
    docker image prune -f
    
    # Remove unused images (older than 24 hours)
    print_status "Removing unused images older than 24 hours..."
    docker image prune -a --filter "until=24h" -f
    
    print_success "Local Docker images cleaned up"
}

# Function to clean up ECR repositories
cleanup_ecr_repositories() {
    print_status "Cleaning up AWS ECR repositories..."
    
    REGION="us-east-1"
    
    # Check if AWS CLI is configured
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        print_warning "AWS CLI not configured. Skipping ECR cleanup."
        return
    fi
    
    # List repositories
    REPOSITORIES=$(aws ecr describe-repositories --region $REGION --query 'repositories[*].repositoryName' --output text 2>/dev/null)
    
    if [ -z "$REPOSITORIES" ]; then
        print_warning "No ECR repositories found"
        return
    fi
    
    for REPO in $REPOSITORIES; do
        print_status "Cleaning up repository: $REPO"
        
        # List images in repository
        IMAGES=$(aws ecr describe-images \
            --repository-name $REPO \
            --region $REGION \
            --query 'imageDetails[*].{Tag:imageTags[0],Digest:imageDigest,PushedAt:pushedAt}' \
            --output json 2>/dev/null)
        
        if [ "$IMAGES" != "[]" ]; then
            # Keep only the latest 3 images
            LATEST_IMAGES=$(echo "$IMAGES" | jq -r 'sort_by(.PushedAt) | reverse | .[0:3] | .[].Digest' 2>/dev/null)
            
            # Get all image digests
            ALL_DIGESTS=$(echo "$IMAGES" | jq -r '.[].Digest' 2>/dev/null)
            
            # Remove old images (not in latest 3)
            for DIGEST in $ALL_DIGESTS; do
                if ! echo "$LATEST_IMAGES" | grep -q "$DIGEST"; then
                    print_status "Removing old image: $DIGEST from $REPO"
                    aws ecr batch-delete-image \
                        --repository-name $REPO \
                        --region $REGION \
                        --image-ids imageDigest=$DIGEST 2>/dev/null || true
                fi
            done
        fi
    done
    
    print_success "ECR repositories cleaned up"
}

# Function to clean up local containers
cleanup_containers() {
    print_status "Cleaning up local containers..."
    
    # Stop all ProductiveMiner containers
    print_status "Stopping ProductiveMiner containers..."
    docker ps -a --format "{{.Names}}" | grep -E "(productiveminer|testnet|adaptive)" | xargs -r docker stop 2>/dev/null || true
    
    # Remove stopped containers
    print_status "Removing stopped containers..."
    docker container prune -f
    
    print_success "Local containers cleaned up"
}

# Function to clean up volumes
cleanup_volumes() {
    print_status "Cleaning up unused volumes..."
    
    # Remove unused volumes
    docker volume prune -f
    
    print_success "Unused volumes cleaned up"
}

# Function to clean up networks
cleanup_networks() {
    print_status "Cleaning up unused networks..."
    
    # Remove unused networks
    docker network prune -f
    
    print_success "Unused networks cleaned up"
}

# Function to show current status
show_status() {
    print_status "Current Docker Status"
    echo "======================"
    
    echo -e "\n${BLUE}Running Containers:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(productiveminer|testnet|adaptive)" || echo "No ProductiveMiner containers running"
    
    echo -e "\n${BLUE}Local Images:${NC}"
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" | grep -E "(productiveminer|testnet)" || echo "No ProductiveMiner images found"
    
    echo -e "\n${BLUE}ECR Repositories:${NC}"
    if aws sts get-caller-identity >/dev/null 2>&1; then
        aws ecr describe-repositories --region us-east-1 --query 'repositories[*].{Name:repositoryName,URI:repositoryUri}' --output table 2>/dev/null || echo "No ECR repositories found"
    else
        echo "AWS CLI not configured"
    fi
}

# Function to rebuild fresh images
rebuild_images() {
    print_status "Rebuilding fresh images..."
    
    # Stop and remove existing containers
    docker-compose -f docker-compose.adaptive.yml down
    
    # Remove old images
    docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "(testnet-adaptive)" | xargs -r docker rmi 2>/dev/null || true
    
    # Rebuild images
    print_status "Building fresh adaptive images..."
    docker-compose -f docker-compose.adaptive.yml build --no-cache
    
    print_success "Fresh images built"
}

# Main menu
main() {
    echo -e "${BLUE}🧹 ProductiveMiner Old Versions Cleanup${NC}"
    echo "=========================================="
    echo ""
    echo "1. Clean up local Docker images"
    echo "2. Clean up ECR repositories"
    echo "3. Clean up local containers"
    echo "4. Clean up volumes and networks"
    echo "5. Show current status"
    echo "6. Rebuild fresh images"
    echo "7. Full cleanup (all of the above)"
    echo "8. Exit"
    echo ""
    read -p "Choose an option (1-8): " choice
    
    case $choice in
        1)
            cleanup_local_images
            ;;
        2)
            cleanup_ecr_repositories
            ;;
        3)
            cleanup_containers
            ;;
        4)
            cleanup_volumes
            cleanup_networks
            ;;
        5)
            show_status
            ;;
        6)
            rebuild_images
            ;;
        7)
            print_status "Performing full cleanup..."
            cleanup_containers
            cleanup_local_images
            cleanup_ecr_repositories
            cleanup_volumes
            cleanup_networks
            rebuild_images
            print_success "Full cleanup completed!"
            ;;
        8)
            print_success "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid option. Please choose 1-8."
            ;;
    esac
}

# Check if script is run with arguments
if [ $# -eq 0 ]; then
    main
else
    case $1 in
        "local")
            cleanup_local_images
            ;;
        "ecr")
            cleanup_ecr_repositories
            ;;
        "containers")
            cleanup_containers
            ;;
        "volumes")
            cleanup_volumes
            cleanup_networks
            ;;
        "status")
            show_status
            ;;
        "rebuild")
            rebuild_images
            ;;
        "full")
            print_status "Performing full cleanup..."
            cleanup_containers
            cleanup_local_images
            cleanup_ecr_repositories
            cleanup_volumes
            cleanup_networks
            rebuild_images
            print_success "Full cleanup completed!"
            ;;
        *)
            echo "Usage: $0 [local|ecr|containers|volumes|status|rebuild|full]"
            echo "Or run without arguments for interactive menu"
            exit 1
            ;;
    esac
fi 