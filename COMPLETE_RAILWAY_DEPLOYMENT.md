# Complete Railway Deployment Guide

## 🚀 Deploy Full Application to Railway

This guide will help you deploy both the backend API and frontend React app to Railway.

### Prerequisites
- Railway account
- GitHub repository connected to Railway
- Backend already deployed (you have this working)

### Step 1: Deploy Backend API (Already Done ✅)

Your backend is already deployed at: `https://productiveminer.up.railway.app`

**Backend Endpoints Working:**
- ✅ `/api/health` - Health check
- ✅ `/api/blocks` - Blockchain data
- ✅ `/api/discoveries` - Mathematical discoveries
- ✅ `/api/validators` - Validator information
- ✅ `/api/mining/status` - Mining status
- ✅ `/api/balance` - User balance
- ✅ `/api/research-repository` - Research data

### Step 2: Deploy Frontend React App

#### Option A: Deploy Frontend as Separate Service (Recommended)

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Go to your existing project

2. **Add New Service for Frontend**
   - Click "Add Service" → "GitHub Repo"
   - Select your repository
   - Configure:
     - **Root Directory**: `frontend`
     - **Branch**: `main`
     - **Dockerfile**: `Dockerfile`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   REACT_APP_BACKEND_URL=https://productiveminer.up.railway.app
   ```

4. **Deploy**
   - Railway will automatically build and deploy your React app
   - You'll get a URL like: `https://your-frontend-service.railway.app`

#### Option B: Update Current Service to Serve Frontend

If you want to update your current Railway service to serve the frontend instead of the backend:

1. **Update Railway Configuration**
   - The `railway.json` file is already configured for frontend
   - Railway will use `frontend/Dockerfile` and serve the React app

2. **Set Environment Variables**
   ```
   NODE_ENV=production
   REACT_APP_BACKEND_URL=https://productiveminer.up.railway.app
   ```

3. **Redeploy**
   - Push changes to GitHub
   - Railway will automatically redeploy with frontend

### Step 3: Verify Deployment

1. **Check Frontend URL**
   - Your React app should be accessible at the Railway URL
   - All tabs should work: Dashboard, Mining Control, Block Explorer, etc.

2. **Test API Connection**
   - Frontend should connect to backend API
   - Check browser console for connection status

3. **Test Features**
   - ✅ Block Explorer
   - ✅ Mining Control
   - ✅ Discoveries
   - ✅ Research Repository
   - ✅ Validators
   - ✅ Wallet

### Architecture

```
Frontend (React) → Railway → Backend (Node.js) → Railway
     ↓                    ↓                    ↓
  Port 3000         Railway Proxy        Port 3000
```

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `REACT_APP_BACKEND_URL` | Backend API URL | `https://productiveminer.up.railway.app` |

### Troubleshooting

**If frontend can't connect to backend:**
1. Verify `REACT_APP_BACKEND_URL` is correct
2. Check backend is running and healthy
3. Ensure CORS is configured properly

**If build fails:**
1. Check `frontend/package.json` has all dependencies
2. Verify `frontend/Dockerfile` is correct
3. Check Railway logs for specific errors

### Quick Commands

```bash
# Update frontend configuration
git add railway.json frontend/src/config/railway.js
git commit -m "🚀 Configure Railway for frontend deployment"
git push origin main
```

### Current Status

- ✅ **Backend API**: Deployed and working
- 🔄 **Frontend**: Ready for deployment
- 🎯 **Next Step**: Deploy frontend service

Your complete application will be accessible through the frontend URL once deployed! 