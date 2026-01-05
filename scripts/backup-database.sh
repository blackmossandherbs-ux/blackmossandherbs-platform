#!/bin/bash

# HECTIC Intellectual Property - Copyright 2024
# Black Moss & Herbs Platform - Database Backup Script
# Enterprise-grade automated backup solution

set -euo pipefail

# Configuration
BACKUP_DIR="/var/backups/blackmossandherbs"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="${DB_NAME:-blackmossandherbs}"
DB_USER="${DB_USER:-dbuser}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🗄️  Black Moss & Herbs - Database Backup${NC}"
echo "=========================================="
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo -e "${YELLOW}Backup directory: $BACKUP_DIR${NC}"

# Get database password
if [ -f "/var/www/blackmossandherbs-platform/.env" ]; then
    export PGPASSWORD=$(grep DATABASE_URL /var/www/blackmossandherbs-platform/.env | sed 's/.*:\/\/.*:\(.*\)@.*/\1/' | tr -d '"')
else
    echo -e "${RED}Error: .env file not found${NC}"
    exit 1
fi

# Backup filename
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"

echo -e "${YELLOW}Creating backup: $BACKUP_FILE${NC}"

# Perform backup
if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
    echo -e "${GREEN}✓ Backup created successfully${NC}"
    
    # Compress backup
    echo -e "${YELLOW}Compressing backup...${NC}"
    gzip "$BACKUP_FILE"
    echo -e "${GREEN}✓ Backup compressed: $COMPRESSED_FILE${NC}"
    
    # Get file size
    SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
    echo -e "${GREEN}Backup size: $SIZE${NC}"
else
    echo -e "${RED}✗ Backup failed${NC}"
    rm -f "$BACKUP_FILE"
    exit 1
fi

# Clean up old backups
echo -e "${YELLOW}Cleaning up old backups (older than $RETENTION_DAYS days)...${NC}"
find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
REMAINING=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | wc -l)
echo -e "${GREEN}✓ Cleanup complete. $REMAINING backups retained.${NC}"

# Verify backup integrity
echo -e "${YELLOW}Verifying backup integrity...${NC}"
if gunzip -t "$COMPRESSED_FILE" 2>/dev/null; then
    echo -e "${GREEN}✓ Backup integrity verified${NC}"
else
    echo -e "${RED}✗ Backup integrity check failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Backup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Backup location: $COMPRESSED_FILE"
echo "Size: $SIZE"
echo "Retention: $RETENTION_DAYS days"
echo ""
