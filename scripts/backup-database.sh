#!/bin/bash

# ============================================
# DATABASE BACKUP AUTOMATION
# Enterprise-grade backup with rotation
# ============================================

set -e

# Configuration
PROJECT_NAME="blackmossherbs"
BACKUP_DIR="/var/backups/blackmossherbs"
RETENTION_DAYS=30
MAX_BACKUPS=50
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql.gz"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 DATABASE BACKUP - $PROJECT_NAME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Get database container name
CONTAINER=$(docker ps --filter "name=${PROJECT_NAME}-db" --format "{{.Names}}" | head -1)

if [ -z "$CONTAINER" ]; then
    echo -e "${RED}❌ Database container not found${NC}"
    echo "Looking for: ${PROJECT_NAME}-db"
    echo ""
    echo "Available containers:"
    docker ps --format "{{.Names}}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found container: $CONTAINER"

# Get database credentials from container
DB_USER=$(docker exec "$CONTAINER" printenv POSTGRES_USER || echo "blackmoss_user")
DB_NAME=$(docker exec "$CONTAINER" printenv POSTGRES_DB || echo "blackmossherbs")

echo -e "${GREEN}✓${NC} Database: $DB_NAME"
echo -e "${GREEN}✓${NC} User: $DB_USER"
echo ""

# Create backup
echo "📦 Creating backup..."
START_TIME=$(date +%s)

if docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    
    echo -e "${GREEN}✓${NC} Backup created successfully"
    echo "  File: $BACKUP_FILE"
    echo "  Size: $BACKUP_SIZE"
    echo "  Time: ${DURATION}s"
else
    echo -e "${RED}❌ Backup failed${NC}"
    rm -f "$BACKUP_FILE"
    exit 1
fi

echo ""

# Verify backup
echo "🔍 Verifying backup..."
if gunzip -t "$BACKUP_FILE" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Backup file is valid"
else
    echo -e "${RED}❌ Backup file is corrupted${NC}"
    exit 1
fi

echo ""

# Cleanup old backups by date
echo "🧹 Cleaning old backups..."
DELETED_COUNT=0

if [ -d "$BACKUP_DIR" ]; then
    while IFS= read -r -d '' file; do
        ((DELETED_COUNT++))
    done < <(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -print0 -delete)
fi

if [ $DELETED_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Deleted $DELETED_COUNT backups older than $RETENTION_DAYS days"
else
    echo -e "${GREEN}✓${NC} No old backups to delete"
fi

# Cleanup by count (keep only latest MAX_BACKUPS)
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | wc -l)
if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
    EXCESS=$((BACKUP_COUNT - MAX_BACKUPS))
    echo "⚠️  Too many backups ($BACKUP_COUNT), removing oldest $EXCESS"
    
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -printf '%T+ %p\n' | \
        sort | head -n "$EXCESS" | cut -d' ' -f2- | xargs rm -f
    
    echo -e "${GREEN}✓${NC} Removed $EXCESS old backups"
fi

# Summary
REMAINING_BACKUPS=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 BACKUP SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Total backups: $REMAINING_BACKUPS"
echo "  Total size: $TOTAL_SIZE"
echo "  Latest: $BACKUP_FILE"
echo "  Retention: $RETENTION_DAYS days"
echo "  Max count: $MAX_BACKUPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ Backup completed successfully${NC}"
echo ""
