#!/bin/bash

# ============================================
# DATABASE RESTORE UTILITY
# Restore from backup with safety checks
# ============================================

set -e

PROJECT_NAME="blackmossherbs"
BACKUP_DIR="/var/backups/blackmossherbs"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 DATABASE RESTORE - $PROJECT_NAME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}❌ Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# List available backups
echo "📋 Available backups:"
echo ""

BACKUPS=($(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | sort -r))

if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo -e "${RED}❌ No backups found${NC}"
    exit 1
fi

for i in "${!BACKUPS[@]}"; do
    BACKUP="${BACKUPS[$i]}"
    FILENAME=$(basename "$BACKUP")
    SIZE=$(du -h "$BACKUP" | cut -f1)
    DATE=$(echo "$FILENAME" | grep -oP '\d{8}_\d{6}' | sed 's/_/ /')
    
    echo "  [$i] $FILENAME ($SIZE) - $DATE"
done

echo ""

# Select backup
if [ -n "$1" ]; then
    BACKUP_INDEX="$1"
else
    read -p "Select backup to restore [0]: " BACKUP_INDEX
    BACKUP_INDEX=${BACKUP_INDEX:-0}
fi

if [ "$BACKUP_INDEX" -lt 0 ] || [ "$BACKUP_INDEX" -ge "${#BACKUPS[@]}" ]; then
    echo -e "${RED}❌ Invalid selection${NC}"
    exit 1
fi

BACKUP_FILE="${BACKUPS[$BACKUP_INDEX]}"
echo -e "${GREEN}✓${NC} Selected: $(basename "$BACKUP_FILE")"
echo ""

# Safety confirmation
echo -e "${YELLOW}⚠️  WARNING: This will REPLACE the current database!${NC}"
echo ""
read -p "Type 'yes' to confirm: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo ""

# Get database container
CONTAINER=$(docker ps --filter "name=${PROJECT_NAME}-db" --format "{{.Names}}" | head -1)

if [ -z "$CONTAINER" ]; then
    echo -e "${RED}❌ Database container not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found container: $CONTAINER"

# Get database credentials
DB_USER=$(docker exec "$CONTAINER" printenv POSTGRES_USER || echo "blackmoss_user")
DB_NAME=$(docker exec "$CONTAINER" printenv POSTGRES_DB || echo "blackmossherbs")

echo -e "${GREEN}✓${NC} Database: $DB_NAME"
echo ""

# Create safety backup of current state
SAFETY_BACKUP="/tmp/pre_restore_${PROJECT_NAME}_$(date +%Y%m%d_%H%M%S).sql.gz"
echo "💾 Creating safety backup of current state..."
docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$SAFETY_BACKUP"
echo -e "${GREEN}✓${NC} Safety backup: $SAFETY_BACKUP"
echo ""

# Restore database
echo "🔄 Restoring database..."
START_TIME=$(date +%s)

if gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER" psql -U "$DB_USER" "$DB_NAME"; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    echo ""
    echo -e "${GREEN}✓${NC} Database restored successfully"
    echo "  Time: ${DURATION}s"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ RESTORE COMPLETED${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Safety backup saved at:"
    echo "  $SAFETY_BACKUP"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Restore failed${NC}"
    echo ""
    echo "Restoring from safety backup..."
    if gunzip -c "$SAFETY_BACKUP" | docker exec -i "$CONTAINER" psql -U "$DB_USER" "$DB_NAME"; then
        echo -e "${GREEN}✓${NC} Rolled back to previous state"
    else
        echo -e "${RED}❌ Rollback failed - database may be in inconsistent state${NC}"
    fi
    exit 1
fi
