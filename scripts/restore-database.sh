#!/bin/bash

# HECTIC Intellectual Property - Copyright 2024
# Black Moss & Herbs Platform - Database Restore Script
# Enterprise-grade database restoration

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${RED}⚠️  DATABASE RESTORE UTILITY${NC}"
echo "=========================================="
echo ""
echo -e "${RED}WARNING: This will REPLACE your current database!${NC}"
echo ""

# Configuration
BACKUP_DIR="/var/backups/blackmossandherbs"
DB_NAME="${DB_NAME:-blackmossandherbs}"
DB_USER="${DB_USER:-dbuser}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# List available backups
echo -e "${YELLOW}Available backups:${NC}"
BACKUPS=($(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | sort -r))
if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo -e "${RED}No backups found in $BACKUP_DIR${NC}"
    exit 1
fi

for i in "${!BACKUPS[@]}"; do
    BACKUP_FILE="${BACKUPS[$i]}"
    BACKUP_NAME=$(basename "$BACKUP_FILE")
    BACKUP_DATE=$(stat -c %y "$BACKUP_FILE" | cut -d' ' -f1,2 | cut -d'.' -f1)
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "  [$i] $BACKUP_NAME ($SIZE) - $BACKUP_DATE"
done

echo ""
read -p "Select backup to restore (0-$((${#BACKUPS[@]} - 1))): " SELECTION

if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 0 ] || [ "$SELECTION" -ge ${#BACKUPS[@]} ]; then
    echo -e "${RED}Invalid selection${NC}"
    exit 1
fi

SELECTED_BACKUP="${BACKUPS[$SELECTION]}"
echo ""
echo -e "${YELLOW}Selected: $(basename "$SELECTED_BACKUP")${NC}"
read -p "Are you SURE you want to restore this backup? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Restore cancelled${NC}"
    exit 0
fi

# Get database password
if [ -f "/var/www/blackmossandherbs-platform/.env" ]; then
    export PGPASSWORD=$(grep DATABASE_URL /var/www/blackmossandherbs-platform/.env | sed 's/.*:\/\/.*:\(.*\)@.*/\1/' | tr -d '"')
else
    echo -e "${RED}Error: .env file not found${NC}"
    exit 1
fi

# Create temporary directory for extraction
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo -e "${YELLOW}Extracting backup...${NC}"
gunzip -c "$SELECTED_BACKUP" > "$TEMP_DIR/restore.sql"

echo -e "${YELLOW}Restoring database...${NC}"
echo -e "${RED}This may take several minutes...${NC}"

# Drop and recreate database (or just restore)
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < "$TEMP_DIR/restore.sql" 2>/dev/null; then
    echo -e "${GREEN}✓ Database restored successfully${NC}"
else
    echo -e "${RED}✗ Restore failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Restore Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Verify data integrity"
echo "  2. Restart application: pm2 restart blackmossandherbs"
echo "  3. Check application logs"
echo ""
