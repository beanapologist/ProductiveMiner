# Railway Deployment Guide

## 🚀 Quick Deploy to Railway

### Prerequisites
- Railway account (railway.app)
- GitHub repository connected

### Deployment Steps

1. **Connect Repository**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Environment Variables**
   Add these environment variables in Railway:
   ```
   NODE_ENV=production
   TESTNET_MODE=true
   METAMASK_ENABLED=true
   JWT_SECRET=your_jwt_secret_here
   QUANTUM_SECURITY_LEVEL=256
   MAX_CONCURRENT_SESSIONS=100
   DEFAULT_DIFFICULTY=25
   ```

3. **Deploy**
   - Railway will automatically detect the Docker setup
   - It will use `docker-compose.testnet.yml` for deployment
   - The API will be available on the Railway domain

4. **Update Frontend API URL**
   - After deployment, update `frontend/src/services/api.js`
   - Change `this.baseURL = 'http://localhost:3000'` to your Railway API URL
   - Redeploy the frontend

### Architecture
- **Backend**: Node.js API on Railway
- **Frontend**: React app with nginx proxy
- **Database**: PostgreSQL (Railway managed)
- **Cache**: Redis (Railway managed)

### Features
- ✅ Real blockchain data only (no synthetic data)
- ✅ Working frontend-backend connection
- ✅ Clean, minimal codebase
- ✅ Railway-ready configuration

### Notes
- The repository is cleaned and optimized for Railway
- All unnecessary files have been removed
- Connection issues have been resolved
- Ready for production deployment 