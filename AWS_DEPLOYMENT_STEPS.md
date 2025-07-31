# 🚀 AWS Deployment Steps for ProductiveMiner

## Step 1: Install AWS CLI

### Option A: Using Homebrew (Recommended for macOS)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install AWS CLI
brew install awscli
```

### Option B: Direct Download
```bash
# Download AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"

# Install it
sudo installer -pkg AWSCLIV2.pkg -target /
```

### Option C: Using pip
```bash
pip3 install awscli
```

## Step 2: Configure AWS CLI

After installation, configure your AWS credentials:

```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: Get this from AWS Console → IAM → Users → Your User → Security credentials
- **AWS Secret Access Key**: Get this from the same place as above
- **Default region**: Enter `us-east-1`
- **Default output format**: Enter `json`

## Step 3: Verify AWS Setup

```bash
# Test your AWS configuration
aws sts get-caller-identity
```

You should see output like:
```json
{
    "UserId": "AIDACKCEVSQ6C2EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/YourUsername"
}
```

## Step 4: Deploy to AWS

Once AWS CLI is configured, run the deployment:

```bash
# Navigate to the aws directory
cd aws

# Make the deployment script executable
chmod +x deploy-to-aws.sh

# Run the deployment
./deploy-to-aws.sh
```

## Step 5: Monitor Deployment

The deployment script will:
1. Create ECR repositories for your Docker images
2. Push your images to ECR
3. Create CloudFormation stack with all infrastructure
4. Deploy your application to ECS
5. Set up load balancer and DNS

## Step 6: Access Your Application

After deployment, you'll get:
- **Load Balancer URL**: `https://[load-balancer-dns]`
- **Domain**: `https://productiveminer.com` (after DNS setup)
- **API**: `https://api.productiveminer.com`
- **Blockchain**: `https://blockchain.productiveminer.com`

## Troubleshooting

### If AWS CLI is not found:
```bash
# Add AWS CLI to your PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### If you get permission errors:
```bash
# Make sure you have the right permissions
aws iam get-user
```

### If deployment fails:
```bash
# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name ProductiveMiner --region us-east-1

# View stack events
aws cloudformation describe-stack-events --stack-name ProductiveMiner --region us-east-1
```

## Quick Commands Summary

```bash
# 1. Install AWS CLI
brew install awscli

# 2. Configure AWS
aws configure

# 3. Test configuration
aws sts get-caller-identity

# 4. Deploy to AWS
cd aws && ./deploy-to-aws.sh

# 5. Check deployment status
aws cloudformation describe-stacks --stack-name ProductiveMiner --region us-east-1
```

## Expected Timeline

- **Installation**: 5-10 minutes
- **Configuration**: 5 minutes
- **Deployment**: 15-20 minutes
- **Total**: ~30 minutes

## Cost Estimate

- **Monthly cost**: $150-270
- **Free tier**: Available for first 12 months
- **No upfront costs**: Pay-as-you-go

---

**Ready to deploy your revolutionary blockchain to AWS!** 🚀 