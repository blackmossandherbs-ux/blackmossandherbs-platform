#!/bin/bash

# ============================================
# AUTOMATED BACKUP CRON SETUP
# Sets up daily database backups
# ============================================

set -e

PROJECT_DIR="/var/www/blackmossandherbs-platform"
BACKUP_SCRIPT="$PROJECT_DIR/scripts/backup-database.sh"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏰ SETTING UP AUTOMATED BACKUPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if backup script exists
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo -e "${RED}❌ Backup script not found: $BACKUP_SCRIPT${NC}"
    exit 1
fi

# Make sure script is executable
chmod +x "$BACKUP_SCRIPT"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    echo -e "${YELLOW}⚠️  Backup cron job already exists${NC}"
    echo ""
    echo "Current cron jobs:"
    crontab -l | grep "$BACKUP_SCRIPT"
    echo ""
    read -p "Update cron job? (y/n): " UPDATE
    
    if [ "$UPDATE" != "y" ]; then
        echo "Cancelled"
        exit 0
    fi
    
    # Remove existing cron job
    crontab -l | grep -v "$BACKUP_SCRIPT" | crontab -
fi

# Add new cron job (daily at 2 AM)
echo "📅 Adding cron job: Daily backup at 2:00 AM"
(crontab -l 2>/dev/null; echo "0 2 * * * $BACKUP_SCRIPT >> /var/log/blackmossherbs-backup.log 2>&1") | crontab -

echo ""
echo -e "${GREEN}✓${NC} Cron job added successfully"
echo ""

# Show current cron jobs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 ACTIVE CRON JOBS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
crontab -l
echo ""

# Create log file
touch /var/log/blackmossherbs-backup.log
chmod 644 /var/log/blackmossherbs-backup.log

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SETUP COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Schedule: Daily at 2:00 AM"
echo "Script: $BACKUP_SCRIPT"
echo "Log file: /var/log/blackmossherbs-backup.log"
echo ""
echo "View logs: tail -f /var/log/blackmossherbs-backup.log"
echo "List backups: ls -lh /var/backups/blackmossherbs/"
echo "Test backup: $BACKUP_SCRIPT"
echo ""
