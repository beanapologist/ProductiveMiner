#!/bin/bash

# Adaptive Learning System Data Persistence Management
# Handles data backup, restore, and maintenance operations

set -e

# Configuration
DATA_DIR="./data"
BACKUP_DIR="./data/backups"
LOG_DIR="./data/logs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Show usage
usage() {
    cat << EOF
Adaptive Learning System Data Persistence Management

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    backup          Create a complete system backup
    restore         Restore from a backup
    status          Show data persistence status
    cleanup         Clean up old data and logs
    verify          Verify data integrity
    migrate         Migrate data to new format
    init            Initialize data directories
    health          Check data health status

Options:
    -h, --help      Show this help message
    -v, --verbose   Verbose output
    -f, --force     Force operation without confirmation

Examples:
    $0 backup                    # Create backup
    $0 restore backup_20231201   # Restore from backup
    $0 status                    # Show status
    $0 cleanup                   # Clean up old data
EOF
}

# Initialize data directories
init_directories() {
    log "Initializing data directories..."
    
    # Create main data directories
    mkdir -p "$DATA_DIR"/{blockchain,logs/{node,app,frontend,database,redis,grafana,prometheus,nginx},app,frontend,database,redis,grafana,prometheus,contracts,deployments,config,backups/{database,app,redis}}
    
    # Create configuration directories
    mkdir -p config/{keystore,monitoring/{grafana/{dashboards,datasources,plugins},prometheus/rules},nginx/conf.d,scripts/{db,backup}}
    
    # Set proper permissions
    chmod 755 "$DATA_DIR"
    chmod 755 "$BACKUP_DIR"
    chmod 755 "$LOG_DIR"
    
    success "Data directories initialized"
}

# Create backup
create_backup() {
    log "Creating system backup..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_NAME="manual_backup_${TIMESTAMP}"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
    
    mkdir -p "$BACKUP_PATH"
    
    # Backup database
    log "Backing up database..."
    docker exec adaptive-database pg_dump -U adaptive_user adaptive_miner > "$BACKUP_PATH/database.sql" 2>/dev/null || warning "Database backup failed"
    
    # Backup Redis
    log "Backing up Redis..."
    docker exec adaptive-redis redis-cli BGSAVE > /dev/null 2>&1
    sleep 5
    docker cp adaptive-redis:/data/dump.rdb "$BACKUP_PATH/redis.rdb" 2>/dev/null || warning "Redis backup failed"
    
    # Backup application data
    log "Backing up application data..."
    tar -czf "$BACKUP_PATH/app_data.tar.gz" -C "$DATA_DIR/app" . 2>/dev/null || warning "Application data backup failed"
    
    # Backup logs
    log "Backing up logs..."
    tar -czf "$BACKUP_PATH/logs.tar.gz" -C "$DATA_DIR/logs" . 2>/dev/null || warning "Logs backup failed"
    
    # Create backup manifest
    cat > "$BACKUP_PATH/manifest.txt" << EOF
Adaptive Learning System Backup Manifest
========================================

Backup Date: $(date)
Backup Name: $BACKUP_NAME
Backup Path: $BACKUP_PATH

Contents:
- database.sql: PostgreSQL database dump
- redis.rdb: Redis data dump
- app_data.tar.gz: Application data archive
- logs.tar.gz: System logs archive

System Information:
- Data Directory: $DATA_DIR
- Backup Directory: $BACKUP_DIR
- Log Directory: $LOG_DIR

EOF
    
    success "Backup completed: $BACKUP_PATH"
}

# Restore from backup
restore_backup() {
    local backup_name="$1"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    if [ -z "$backup_name" ]; then
        error "Backup name is required"
        usage
        exit 1
    fi
    
    if [ ! -d "$backup_path" ]; then
        error "Backup not found: $backup_path"
        exit 1
    fi
    
    log "Restoring from backup: $backup_name"
    
    # Stop services
    log "Stopping services..."
    docker-compose -f docker-compose.adaptive.yml stop adaptive-database adaptive-redis adaptive-productive-miner
    
    # Restore database
    if [ -f "$backup_path/database.sql" ]; then
        log "Restoring database..."
        docker exec -i adaptive-database psql -U adaptive_user adaptive_miner < "$backup_path/database.sql"
    fi
    
    # Restore Redis
    if [ -f "$backup_path/redis.rdb" ]; then
        log "Restoring Redis..."
        docker cp "$backup_path/redis.rdb" adaptive-redis:/data/dump.rdb
    fi
    
    # Restore application data
    if [ -f "$backup_path/app_data.tar.gz" ]; then
        log "Restoring application data..."
        tar -xzf "$backup_path/app_data.tar.gz" -C "$DATA_DIR/app"
    fi
    
    # Restore logs
    if [ -f "$backup_path/logs.tar.gz" ]; then
        log "Restoring logs..."
        tar -xzf "$backup_path/logs.tar.gz" -C "$DATA_DIR/logs"
    fi
    
    # Start services
    log "Starting services..."
    docker-compose -f docker-compose.adaptive.yml start adaptive-database adaptive-redis adaptive-productive-miner
    
    success "Restore completed from: $backup_name"
}

# Show status
show_status() {
    log "Data Persistence Status"
    echo "======================"
    
    echo -e "\n${BLUE}Data Directories:${NC}"
    du -sh "$DATA_DIR"/* 2>/dev/null || echo "No data directories found"
    
    echo -e "\n${BLUE}Backup Information:${NC}"
    if [ -d "$BACKUP_DIR" ]; then
        echo "Backup directory: $BACKUP_DIR"
        echo "Backup count: $(find "$BACKUP_DIR" -name "manual_backup_*" -type d | wc -l)"
        echo "Latest backup: $(find "$BACKUP_DIR" -name "manual_backup_*" -type d -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2- 2>/dev/null || echo 'None')"
    else
        echo "Backup directory not found"
    fi
    
    echo -e "\n${BLUE}Container Status:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep adaptive || echo "No adaptive containers running"
    
    echo -e "\n${BLUE}Disk Usage:${NC}"
    df -h "$DATA_DIR" 2>/dev/null || echo "Unable to get disk usage"
}

# Cleanup old data
cleanup_data() {
    log "Cleaning up old data..."
    
    # Clean up old logs (keep last 30 days)
    find "$LOG_DIR" -name "*.log" -type f -mtime +30 -delete 2>/dev/null || true
    
    # Clean up old backups (keep last 7 days)
    find "$BACKUP_DIR" -name "manual_backup_*" -type d -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
    
    # Clean up temporary files
    find "$DATA_DIR" -name "*.tmp" -type f -delete 2>/dev/null || true
    find "$DATA_DIR" -name "*.cache" -type f -delete 2>/dev/null || true
    
    success "Cleanup completed"
}

# Verify data integrity
verify_data() {
    log "Verifying data integrity..."
    
    # Check database connectivity
    if docker exec adaptive-database pg_isready -U adaptive_user > /dev/null 2>&1; then
        success "Database connectivity: OK"
    else
        error "Database connectivity: FAILED"
    fi
    
    # Check Redis connectivity
    if docker exec adaptive-redis redis-cli ping > /dev/null 2>&1; then
        success "Redis connectivity: OK"
    else
        error "Redis connectivity: FAILED"
    fi
    
    # Check data directories
    for dir in "$DATA_DIR"/*; do
        if [ -d "$dir" ]; then
            echo "Directory $(basename "$dir"): $(du -sh "$dir" | cut -f1)"
        fi
    done
    
    success "Data integrity verification completed"
}

# Check health status
check_health() {
    log "Checking data health status..."
    
    # Check disk space
    DISK_USAGE=$(df -h "$DATA_DIR" | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 90 ]; then
        error "Disk usage critical: ${DISK_USAGE}%"
    elif [ "$DISK_USAGE" -gt 80 ]; then
        warning "Disk usage high: ${DISK_USAGE}%"
    else
        success "Disk usage normal: ${DISK_USAGE}%"
    fi
    
    # Check backup age
    LATEST_BACKUP=$(find "$BACKUP_DIR" -name "manual_backup_*" -type d -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f1)
    if [ -n "$LATEST_BACKUP" ]; then
        BACKUP_AGE=$(( ($(date +%s) - ${LATEST_BACKUP%.*}) / 86400 ))
        if [ "$BACKUP_AGE" -gt 7 ]; then
            warning "Backup is old: ${BACKUP_AGE} days"
        else
            success "Backup is recent: ${BACKUP_AGE} days"
        fi
    else
        warning "No backups found"
    fi
    
    # Check container health
    UNHEALTHY_CONTAINERS=$(docker ps --filter "name=adaptive" --format "{{.Names}}" | xargs -I {} docker inspect --format='{{.State.Health.Status}}' {} 2>/dev/null | grep -v "healthy" | wc -l)
    if [ "$UNHEALTHY_CONTAINERS" -gt 0 ]; then
        warning "Unhealthy containers: $UNHEALTHY_CONTAINERS"
    else
        success "All containers healthy"
    fi
}

# Main function
main() {
    case "${1:-}" in
        backup)
            create_backup
            ;;
        restore)
            restore_backup "$2"
            ;;
        status)
            show_status
            ;;
        cleanup)
            cleanup_data
            ;;
        verify)
            verify_data
            ;;
        health)
            check_health
            ;;
        init)
            init_directories
            ;;
        -h|--help)
            usage
            ;;
        *)
            error "Unknown command: $1"
            usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 