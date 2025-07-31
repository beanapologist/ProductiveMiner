# 🚀 Elastic IP Assignment Guide for ProductiveMiner-Service-Custom

This guide explains how to assign a permanent Elastic IP address to your ProductiveMiner-Service-Custom cluster in AWS.

## 📋 Overview

An Elastic IP provides a static, public IPv4 address that you can allocate to your AWS account and associate with your ProductiveMiner service. This ensures your service always has the same public IP address, even if the underlying infrastructure changes.

## 🎯 Benefits of Elastic IP

- **Permanent IP Address**: Your service keeps the same IP even after restarts
- **DNS Stability**: No need to update DNS records when IPs change
- **Professional Appearance**: Consistent IP for production services
- **Load Balancer Integration**: Works seamlessly with Network Load Balancer

## 🛠️ Available Scripts

### 1. **Deploy with Elastic IP** (`deploy-with-elastic-ip.sh`)
**Use this if you don't have the service deployed yet or want to start fresh.**

```bash
cd aws
./deploy-with-elastic-ip.sh
```

This script will:
- Create all necessary infrastructure (VPC, subnets, security groups)
- Allocate an Elastic IP
- Create a Network Load Balancer
- Deploy the ECS service with the Elastic IP
- Test the connectivity

### 2. **Assign Elastic IP to Existing Service** (`assign-elastic-ip.sh`)
**Use this if you already have the ProductiveMiner-Service-Custom running.**

```bash
cd aws
./assign-elastic-ip.sh
```

This script will:
- Find your existing ECS service
- Allocate a new Elastic IP
- Create a Network Load Balancer
- Update your service to use the Elastic IP
- Test the connectivity

### 3. **Manage Elastic IP** (`manage-elastic-ip.sh`)
**Use this for ongoing management of your Elastic IP.**

```bash
cd aws

# Check current status
./manage-elastic-ip.sh status

# Test connectivity
./manage-elastic-ip.sh test

# Get detailed information
./manage-elastic-ip.sh info

# Release the Elastic IP (WARNING: This removes the IP)
./manage-elastic-ip.sh release

# Assign a new Elastic IP
./manage-elastic-ip.sh reassign
```

## 🚀 Quick Start

### Option 1: Fresh Deployment with Elastic IP

```bash
# Navigate to the aws directory
cd aws

# Deploy with Elastic IP
./deploy-with-elastic-ip.sh
```

### Option 2: Add Elastic IP to Existing Service

```bash
# Navigate to the aws directory
cd aws

# Assign Elastic IP to existing service
./assign-elastic-ip.sh
```

## 📊 What Gets Created

When you assign an Elastic IP, the following AWS resources are created:

1. **Elastic IP Address** - Static public IP
2. **Network Load Balancer (NLB)** - Load balancer that uses the Elastic IP
3. **Target Group** - Routes traffic to your ECS tasks
4. **Listener** - Listens on port 80 and forwards to your application
5. **Updated ECS Service** - Configured to use the NLB instead of direct public IP

## 🌐 Access Your Service

After successful deployment, you can access your service at:

```
http://[YOUR_ELASTIC_IP]
http://[YOUR_ELASTIC_IP]/health
http://[YOUR_ELASTIC_IP]/api
```

## 🔧 Architecture

```
Internet → Elastic IP → Network Load Balancer → Target Group → ECS Service → Container
```

## 📋 Prerequisites

Before running the scripts, ensure you have:

1. **AWS CLI installed and configured**
   ```bash
   aws configure
   ```

2. **Docker installed** (for building and pushing images)

3. **jq installed** (for JSON parsing)
   ```bash
   # On macOS
   brew install jq
   
   # On Ubuntu/Debian
   sudo apt-get install jq
   ```

4. **curl installed** (for testing connectivity)

## 🧪 Testing Your Deployment

### Test Basic Connectivity
```bash
# Get your Elastic IP
./manage-elastic-ip.sh status

# Test health endpoint
curl http://[YOUR_ELASTIC_IP]/health

# Test API endpoint
curl http://[YOUR_ELASTIC_IP]/api/status
```

### Test with Management Script
```bash
./manage-elastic-ip.sh test
```

## 💰 Cost Considerations

- **Elastic IP**: ~$3.65/month when associated with a running instance
- **Network Load Balancer**: ~$16.20/month
- **Data Processing**: ~$0.006 per GB
- **Total estimated cost**: ~$20-25/month

## ⚠️ Important Notes

1. **Elastic IP Charges**: You are charged for Elastic IPs even when not associated with a running instance
2. **IP Persistence**: The IP remains yours until you explicitly release it
3. **Service Updates**: The service will be briefly unavailable during the Elastic IP assignment
4. **Security**: The service will be accessible on port 80 (HTTP)

## 🔄 Updating Your Service

To update your service with new code:

```bash
# Build and push new Docker images
docker build -t testnet-adaptive-app:latest .
docker build -t testnet-adaptive-frontend:latest .

# Tag and push to ECR
docker tag testnet-adaptive-app:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/productiveminer-app:latest

# Update the ECS service
aws ecs update-service \
    --cluster ProductiveMiner-Cluster-Custom \
    --service ProductiveMiner-Service-Custom \
    --force-new-deployment \
    --region us-east-1
```

## 🛠️ Troubleshooting

### Service Not Responding
```bash
# Check service status
aws ecs describe-services \
    --cluster ProductiveMiner-Cluster-Custom \
    --services ProductiveMiner-Service-Custom \
    --region us-east-1

# Check target group health
aws elbv2 describe-target-health \
    --target-group-arn [TARGET_GROUP_ARN] \
    --region us-east-1
```

### Elastic IP Not Working
```bash
# Check Elastic IP status
./manage-elastic-ip.sh status

# Test connectivity
./manage-elastic-ip.sh test

# Get detailed info
./manage-elastic-ip.sh info
```

### Release and Reassign
```bash
# If you need to start fresh
./manage-elastic-ip.sh release
./manage-elastic-ip.sh reassign
```

## 📞 Support

If you encounter issues:

1. Check the AWS CloudWatch logs for your ECS service
2. Verify your security group allows traffic on port 80
3. Ensure your application is listening on port 3000 inside the container
4. Check that the Network Load Balancer is in the "active" state

## 🎉 Success Indicators

Your Elastic IP assignment is successful when:

- ✅ The script completes without errors
- ✅ You can access `http://[ELASTIC_IP]/health`
- ✅ The service responds to API requests
- ✅ The IP address remains the same after service restarts

---

**Happy deploying! 🚀** 