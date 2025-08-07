// Railway deployment configuration
export const RAILWAY_CONFIG = {
  // Backend API URL - will be set by Railway environment variable
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'https://productiveminer.up.railway.app',
  
  // Frontend URL - will be set by Railway
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3001',
  
  // Environment detection
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_RAILWAY: process.env.RAILWAY_ENVIRONMENT === 'production'
};

// Helper function to get the correct backend URL
export const getBackendUrl = () => {
  // For local development, always use localhost:3000
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  
  // For Railway or production, use the Railway backend URL
  if (RAILWAY_CONFIG.IS_RAILWAY || RAILWAY_CONFIG.IS_PRODUCTION) {
    return RAILWAY_CONFIG.BACKEND_URL;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3000';
}; 