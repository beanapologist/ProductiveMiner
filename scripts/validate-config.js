#!/usr/bin/env node

// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateConfig() {
  log('🔍 Validating ProductiveMiner Testnet Configuration...', 'blue');
  
  const requiredEnvVars = [
    'DATABASE_URL',
    'NODE_ENV',
    'PORT',
    'HOST',
    'TESTNET_MODE',
    'MAX_CONCURRENT_SESSIONS',
    'DEFAULT_DIFFICULTY',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'LOG_LEVEL',
    'RATE_LIMIT_WINDOW_MS',
    'RATE_LIMIT_MAX_REQUESTS',
    'MINING_RATE_LIMIT_MAX',
    'ENABLE_ALL_WORK_TYPES',
    'PRIME_COMPUTATION_TIMEOUT',
    'RIEMANN_COMPUTATION_TIMEOUT',
    'QUANTUM_SECURITY_LEVEL',
    'GENESIS_BLOCK_REWARD',
    'DIFFICULTY_ADJUSTMENT_INTERVAL',
    'TARGET_BLOCK_TIME',
    'API_RATE_LIMIT',
    'API_TIMEOUT',
    'MAX_REQUEST_SIZE',
    'WS_HEARTBEAT_INTERVAL',
    'WS_MAX_CONNECTIONS'
  ];

  const optionalEnvVars = [
    'REDIS_URL',
    'REDIS_PASSWORD',
    'ENABLE_DEBUG_LOGS',
    'METRICS_ENABLED',
    'ENABLE_DETAILED_LOGGING',
    'ENABLE_PERFORMANCE_MONITORING',
    'ENABLE_SQL_QUERY_LOGGING',
    'SKIP_AUTHENTICATION'
  ];

  let allValid = true;
  const missing = [];
  const warnings = [];

  // Check required environment variables
  log('\n📋 Checking Required Environment Variables:', 'blue');
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
      allValid = false;
      log(`❌ Missing: ${envVar}`, 'red');
    } else {
      log(`✅ Found: ${envVar}`, 'green');
    }
  }

  // Check optional environment variables
  log('\n📋 Checking Optional Environment Variables:', 'blue');
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      log(`⚠️  Optional: ${envVar} (not set)`, 'yellow');
    } else {
      log(`✅ Found: ${envVar}`, 'green');
    }
  }

  // Validate specific values
  log('\n🔍 Validating Configuration Values:', 'blue');
  
  // Check NODE_ENV
  if (process.env.NODE_ENV !== 'testnet') {
    warnings.push('NODE_ENV should be "testnet" for testnet deployment');
    log('⚠️  NODE_ENV should be "testnet"', 'yellow');
  }

  // Check PORT
  const port = parseInt(process.env.PORT || '0');
  if (port < 1 || port > 65535) {
    missing.push('PORT (invalid value)');
    allValid = false;
    log('❌ PORT must be between 1 and 65535', 'red');
  }

  // Check security settings
  if (process.env.JWT_SECRET === 'testnet_jwt_secret_please_change_this_in_production') {
    warnings.push('JWT_SECRET should be changed from default value');
    log('⚠️  JWT_SECRET should be changed from default', 'yellow');
  }

  if (process.env.ENCRYPTION_KEY === 'testnet_32_byte_encryption_key_change_this') {
    warnings.push('ENCRYPTION_KEY should be changed from default value');
    log('⚠️  ENCRYPTION_KEY should be changed from default', 'yellow');
  }

  // Check mathematical engine settings
  const quantumLevel = parseInt(process.env.QUANTUM_SECURITY_LEVEL || '0');
  if (quantumLevel < 128) {
    warnings.push('QUANTUM_SECURITY_LEVEL should be at least 128');
    log('⚠️  QUANTUM_SECURITY_LEVEL should be at least 128', 'yellow');
  }

  // Check rate limiting
  const rateLimit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '0');
  if (rateLimit < 10) {
    warnings.push('RATE_LIMIT_MAX_REQUESTS should be at least 10');
    log('⚠️  RATE_LIMIT_MAX_REQUESTS should be at least 10', 'yellow');
  }

  // Check file structure
  log('\n📁 Checking File Structure:', 'blue');
  const requiredFiles = [
    'package.json',
    'drizzle.config.ts',
    'drizzle/schema.ts',
    'docker-compose.yml',
    'Dockerfile',
    'nginx/nginx.conf',
    'init.sql'
  ];

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      log(`✅ Found: ${file}`, 'green');
    } else {
      missing.push(file);
      allValid = false;
      log(`❌ Missing: ${file}`, 'red');
    }
  }

  // Summary
  log('\n📊 Configuration Validation Summary:', 'blue');
  
  if (missing.length > 0) {
    log(`❌ Missing ${missing.length} required items:`, 'red');
    missing.forEach(item => log(`   - ${item}`, 'red'));
    allValid = false;
  }

  if (warnings.length > 0) {
    log(`⚠️  ${warnings.length} warnings:`, 'yellow');
    warnings.forEach(warning => log(`   - ${warning}`, 'yellow'));
  }

  if (allValid) {
    log('\n🎉 Configuration validation passed!', 'green');
    log('✅ All required environment variables and files are present', 'green');
    if (warnings.length > 0) {
      log('⚠️  Please review the warnings above', 'yellow');
    }
    process.exit(0);
  } else {
    log('\n❌ Configuration validation failed!', 'red');
    log('Please fix the missing items before proceeding', 'red');
    process.exit(1);
  }
}

// Run validation
validateConfig(); 