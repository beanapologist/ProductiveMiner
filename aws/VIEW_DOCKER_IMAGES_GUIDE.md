# 🐳 View Docker Images in AWS ECR

This guide shows you how to view and manage your Docker images stored in AWS ECR (Elastic Container Registry).

## 🚀 Quick Start

### Using the Script (Recommended)
```bash
cd aws

# List all repositories
./view-docker-images.sh list

# List images in a specific repository
./view-docker-images.sh images productiveminer-app

# Show latest image details
./view-docker-images.sh latest productiveminer-app

# Open ECR in AWS Console
./view-docker-images.sh web
```

## 📋 Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `list` | List all ECR repositories | `./view-docker-images.sh list` |
| `images` | List images in a repository | `./view-docker-images.sh images productiveminer-app` |
| `details` | Show detailed image info | `./view-docker-images.sh details productiveminer-app` |
| `tags` | List all image tags | `./view-docker-images.sh tags productiveminer-app` |
| `latest` | Show latest image details | `./view-docker-images.sh latest productiveminer-app` |
| `size` | Show image sizes | `./view-docker-images.sh size productiveminer-app` |
| `web` | Open ECR in AWS Console | `./view-docker-images.sh web` |
| `login` | Show ECR login commands | `./view-docker-images.sh login` |

## 🔧 Manual AWS CLI Commands

### 1. List All ECR Repositories
```bash
aws ecr describe-repositories --region us-east-1
```

### 2. List Images in a Repository
```bash
aws ecr describe-images \
    --repository-name productiveminer-app \
    --region us-east-1
```

### 3. List Image Tags
```bash
aws ecr describe-images \
    --repository-name productiveminer-app \
    --region us-east-1 \
    --query 'imageDetails[*].imageTags[]' \
    --output table
```

### 4. Show Latest Image
```bash
aws ecr describe-images \
    --repository-name productiveminer-app \
    --region us-east-1 \
    --query 'imageDetails | sort_by(.pushedAt) | reverse | [0]' \
    --output json
```

### 5. Show Image Sizes
```bash
aws ecr describe-images \
    --repository-name productiveminer-app \
    --region us-east-1 \
    --query 'imageDetails[*].{Tag:imageTags[0],SizeMB:imageSizeInBytes}' \
    --output json
```

## 🌐 View in AWS Console

### Method 1: Direct URL
Open this URL in your browser:
```
https://console.aws.amazon.com/ecr/repositories?region=us-east-1
```

### Method 2: Using the Script
```bash
./view-docker-images.sh web
```

### Method 3: Navigate Manually
1. Go to AWS Console
2. Navigate to ECR (Elastic Container Registry)
3. Select your region (us-east-1)
4. Click on your repository name

## 📊 Understanding the Output

### Repository Information
- **Repository Name**: The name of your Docker repository
- **Repository URI**: Full URI for pulling images
- **Created At**: When the repository was created

### Image Information
- **Tag**: Image tag (e.g., "latest", "v1.0.0")
- **Digest**: Unique identifier for the image
- **Size**: Size in bytes (convert to MB by dividing by 1024²)
- **Pushed At**: When the image was pushed to ECR

## 🔐 ECR Authentication

### Login to ECR
```bash
aws ecr get-login-password --region us-east-1 | \
docker login --username AWS --password-stdin \
$(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com
```

### Pull an Image
```bash
docker pull $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/productiveminer-app:latest
```

### Push an Image
```bash
# Tag your image
docker tag your-image:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/productiveminer-app:latest

# Push to ECR
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/productiveminer-app:latest
```

## 🐳 Local Docker Commands

### List Local Images
```bash
docker images | grep productiveminer
```

### Show Image Details
```bash
docker inspect productiveminer-app:latest
```

### Show Image History
```bash
docker history productiveminer-app:latest
```

### Remove Local Images
```bash
docker rmi productiveminer-app:latest
```

## 📈 Common Use Cases

### 1. Check What Images Are Available
```bash
./view-docker-images.sh list
./view-docker-images.sh images productiveminer-app
```

### 2. Find the Latest Version
```bash
./view-docker-images.sh latest productiveminer-app
```

### 3. Check Image Sizes
```bash
./view-docker-images.sh size productiveminer-app
```

### 4. Pull Latest Image
```bash
# First, get the latest image info
LATEST_INFO=$(./view-docker-images.sh latest productiveminer-app)

# Then pull it
docker pull $(echo "$LATEST_INFO" | grep "Full URI" | cut -d' ' -f3)
```

### 5. Compare Image Versions
```bash
# List all tags
./view-docker-images.sh tags productiveminer-app

# Show details for each
./view-docker-images.sh details productiveminer-app
```

## 🔍 Troubleshooting

### No Images Found
```bash
# Check if repository exists
aws ecr describe-repositories --region us-east-1

# Check if you have the right permissions
aws sts get-caller-identity
```

### Permission Denied
```bash
# Check your AWS credentials
aws configure list

# Verify ECR permissions
aws ecr get-login-password --region us-east-1
```

### Can't Pull Images
```bash
# Login to ECR first
aws ecr get-login-password --region us-east-1 | \
docker login --username AWS --password-stdin \
$(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com
```

## 💰 Cost Considerations

- **Storage**: ~$0.10 per GB per month
- **Data Transfer**: ~$0.09 per GB (outbound)
- **API Requests**: ~$0.0001 per request

## 🎯 Best Practices

1. **Use Tags**: Always tag your images with meaningful versions
2. **Clean Up**: Remove old images to save storage costs
3. **Monitor Size**: Keep image sizes reasonable
4. **Use Latest**: Always have a "latest" tag for the most recent version
5. **Document**: Keep track of what each image contains

## 📝 Example Workflow

```bash
# 1. Check what's available
./view-docker-images.sh list

# 2. See what's in your app repository
./view-docker-images.sh images productiveminer-app

# 3. Get details of the latest image
./view-docker-images.sh latest productiveminer-app

# 4. Pull the latest image
docker pull $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/productiveminer-app:latest

# 5. Run the image locally
docker run -p 3000:3000 $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/productiveminer-app:latest
```

## 🔗 Related Commands

### View ECS Service Status
```bash
aws ecs describe-services \
    --cluster ProductiveMiner-Cluster-Custom \
    --services ProductiveMiner-Service-Custom \
    --region us-east-1
```

### View ECS Task Details
```bash
aws ecs describe-tasks \
    --cluster ProductiveMiner-Cluster-Custom \
    --tasks $(aws ecs list-tasks --cluster ProductiveMiner-Cluster-Custom --query 'taskArns[0]' --output text) \
    --region us-east-1
```

### View CloudWatch Logs
```bash
aws logs describe-log-groups \
    --log-group-name-prefix /ecs/ProductiveMiner-Custom \
    --region us-east-1
```

---

**Happy Docker-ing! 🐳** 