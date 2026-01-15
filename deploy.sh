#!/bin/bash

# Black Moss & Herbs - Production Deployment
# Server: 161.97.137.85 (root)

echo "🚀 Starting Direct Deployment to Blackmoss Production..."

# 1. Sync Files (Local -> Remote)
# Excluding node_modules, .next, .git to save bandwidth
echo "📦 Syncing files..."
rsync -avz -e "ssh -i /Users/romeovalentine/.ssh/hectic_cicd -o StrictHostKeyChecking=no" --exclude 'node_modules' --exclude '.next' --exclude '.git' --exclude '.env' ./ root@161.97.137.85:/var/www/blackmossandherbs-platform

# 2. Remote Build & Restart
echo "🔄 Executing Remote Build..."
ssh -i /Users/romeovalentine/.ssh/hectic_cicd -o StrictHostKeyChecking=no root@161.97.137.85 << 'EOF'
  cd /var/www/blackmossandherbs-platform
  
  # Ensure we have the latest dependencies
  echo 'Installing Dependencies...'
  npm install

  # Sync Database Schema
  echo 'Pushing DB Schema...'
  npx prisma generate
  npx prisma db push

  # Build Application
  echo 'Building Next.js Application...'
  npm run build

  # Restart Process
  echo 'Restarting PM2 Process...'
  pm2 restart blackmoss-platform || pm2 start npm --name "blackmoss-platform" -- start
  
  echo '✅ Deployment Complete!'
EOF
 Site is live at https://blackmossandherbs.com"
