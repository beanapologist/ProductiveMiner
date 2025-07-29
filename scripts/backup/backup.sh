#!/bin/bash

# Adaptive Learning System Backup Script
# This script backs up the database, Redis, and application data

set -e

# Configuration
BACKUP_DIR="/backups"
DB_HOST="${DB_HOST:-adaptive-db}"
REDIS_HOST="${REDIS_HOST:-adaptive-redis}"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

echo "Starting backup at $(date)"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup PostgreSQL database
echo "Backing up PostgreSQL database..."
pg_dump -h "$DB_HOST" -U adaptive_user -d adaptive_miner > "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup Redis data
echo "Backing up Redis data..."
redis-cli -h "$REDIS_HOST" BGSAVE
sleep 5
cp /source/redis/dump.rdb "$BACKUP_DIR/redis_backup_$DATE.rdb" 2>/dev/null || echo "Redis backup not available"

# Backup application data
echo "Backing up application data..."
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" -C /source/app . 2>/dev/null || echo "App backup not available"

# Clean up old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "*.sql" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.rdb" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed at $(date)" 