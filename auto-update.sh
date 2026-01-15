#!/bin/bash

# Black Moss & Herbs - Auto-Update Script
# This script pulls the latest changes from GitHub and redeploys the application.

APP_DIR="/var/www/blackmossandherbs-platform"

echo "🔄 Starting auto-update..."

cd $APP_DIR || exit

# 1. Pull latest changes
echo "📥 Pulling from GitHub..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Database migrations (if any)
echo "🗄️ Running database sync..."
npx prisma generate
npx prisma db push --accept-data-loss

# 4. Rebuild the application
echo "🏗️ Building the application..."
npm run build

# 5. Restart the application
echo "🚀 Restarting with PM2..."
pm2 restart blackmossandherbs

echo "✅ Update complete!"
