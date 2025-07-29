module.exports = {
  apps: [
    {
      name: 'productiveminer-testnet',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
        HOST: '0.0.0.0'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        HOST: '0.0.0.0'
      },
      env_testnet: {
        NODE_ENV: 'testnet',
        PORT: 5000,
        HOST: '0.0.0.0',
        TESTNET_MODE: 'true',
        MAX_CONCURRENT_SESSIONS: 50,
        DEFAULT_DIFFICULTY: 25
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000
    }
  ],

  deploy: {
    testnet: {
      user: 'deploy',
      host: 'your-testnet-server.com',
      ref: 'origin/testnet',
      repo: 'git@github.com:your-repo/productiveminer.git',
      path: '/var/www/productiveminer-testnet',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && npm run db:push && pm2 reload ecosystem.config.js --env testnet',
      'pre-setup': ''
    },
    production: {
      user: 'deploy',
      host: 'your-production-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/productiveminer.git',
      path: '/var/www/productiveminer',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && npm run db:push && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}; 