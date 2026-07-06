#!/bin/bash

# Black Moss & Herbs - Automated Cleanup Script
# This script cleans up logs, temporary files, and Docker resources to save disk space.

echo "🧹 Starting server cleanup..."

# 1. Clean up Npc/Npm cache
echo "📦 Cleaning npm cache..."
npm cache clean --force

# 2. Clean up System Logs (older than 7 days)
echo "📜 Cleaning system logs..."
find /var/log -type f -name "*.log" -mtime +7 -exec truncate -s 0 {} \;

# 3. Clean up PM2 logs
echo "⚙️ Cleaning PM2 logs..."
pm2 flush

# 4. Clean up Docker (if used)
if command -v docker &> /dev/null; then
    echo "🐳 Cleaning Docker resources..."
    docker system prune -f --volumes
fi

# 5. Clean up temporary files
echo "📁 Cleaning temporary files..."
rm -rf /tmp/*

echo "✅ Cleanup complete!"
df -h
