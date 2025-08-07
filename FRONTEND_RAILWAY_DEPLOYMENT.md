# Frontend Railway Deployment Guide

## 🚀 Deploy Frontend to Railway

### Prerequisites
- Railway account
- Backend already deployed on Railway
- GitHub repository connected to Railway

### Step 1: Create New Railway Service for Frontend

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Create a new project or use existing project

2. **Add New Service**
   - Click "Add Service" → "GitHub Repo"
   - Select your repository
   - Choose "Deploy from GitHub branch"

3. **Configure Service**
   - **Root Directory**: `frontend`
   - **Branch**: `main`
   - **Dockerfile**: `Dockerfile`

### Step 2: Configure Environment Variables

Add these environment variables in Railway:

```
NODE_ENV=production
REACT_APP_BACKEND_URL=https://your-backend-service.railway.app
REACT_APP_FRONTEND_URL=https://your-frontend-service.railway.app
```

**Important**: Replace `your-backend-service.railway.app` with your actual backend Railway URL.

### Step 3: Deploy

1. **Railway will automatically:**
   - Build the frontend using `frontend/Dockerfile`
   - Install dependencies with `npm install`
   - Build the React app with `npm run build`
   - Serve the built app with `serve -s build -l 3000`

2. **Access your frontend:**
   - Railway will provide a URL like: `https://your-frontend-service.railway.app`
   - Your React app will be accessible at this URL

### Step 4: Verify Connection

1. **Check Frontend-Backend Connection:**
   - Open your frontend URL
   - Check browser console for connection status
   - Verify API calls are working

2. **Test Features:**
   - Block Explorer
   - Mining Control
   - Discoveries
   - Research Repository
   - Validators

### Troubleshooting

**If frontend can't connect to backend:**
1. Verify `REACT_APP_BACKEND_URL` is correct
2. Check backend is running and healthy
3. Ensure CORS is configured properly

**If build fails:**
1. Check `frontend/package.json` has all dependencies
2. Verify `frontend/Dockerfile` is correct
3. Check Railway logs for specific errors

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
| `REACT_APP_BACKEND_URL` | Backend API URL | `https://backend.railway.app` |
| `REACT_APP_FRONTEND_URL` | Frontend URL | `https://frontend.railway.app` |

### Quick Deploy Commands

```bash
# If you need to update the frontend
git add frontend/
git commit -m "🚀 Update frontend for Railway deployment"
git push origin main
```

Railway will automatically redeploy when you push to the main branch. 