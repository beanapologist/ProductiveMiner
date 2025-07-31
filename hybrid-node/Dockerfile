FROM debian:bullseye-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN useradd -m -u 1000 -U -s /bin/sh -d /app app

# Copy the pre-built binary
COPY target/release/hybrid-node /usr/local/bin/

# Create data directory
RUN mkdir -p /app/data && chown -R app:app /app

# Switch to app user
USER app

# Set working directory
WORKDIR /app

# Expose ports for public access
EXPOSE 9944 9945 30333 9615

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:9944/health || exit 1

# Start the hybrid node with public access
CMD ["hybrid-node", "--dev", "--ws-external", "--rpc-external", "--rpc-cors", "all", "--unsafe-rpc-external", "--unsafe-ws-external", "--name", "TestNet-Node", "--base-path", "/app/data"] 