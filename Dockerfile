# ProductiveMiner Testnet Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    postgresql-client \
    curl \
    bash

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S productiveminer -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies, skip optional dependencies
RUN npm ci --only=production --no-optional

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p /app/logs && chown productiveminer:nodejs /app/logs

# Switch to non-root user
USER productiveminer

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/status || exit 1

# Start the application
CMD ["node", "index.js"] 