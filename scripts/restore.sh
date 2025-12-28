#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore.sh <backup_file.sql.gz>"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will replace the current database!"
read -p "Are you sure you want to continue? (yes/no) " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Restore cancelled."
    exit 1
fi

echo "🔄 Restoring database from $BACKUP_FILE..."

# Drop and recreate database
docker-compose exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS blackmoss_herbs;"
docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE blackmoss_herbs;"

# Restore backup
gunzip -c "$BACKUP_FILE" | docker-compose exec -T postgres psql -U postgres blackmoss_herbs

echo "✅ Database restored successfully!"
