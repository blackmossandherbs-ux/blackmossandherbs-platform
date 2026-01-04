#!/bin/bash

# Black Moss & Herbs - Quick Deploy Script for Multi-Site Server
# Server: 213.199.45.126
# Port: 3005 (to avoid conflicts with other sites like DJ Danny Hectic B on port 3000)
#
# Usage: ./quick-deploy.sh
#
# This script will:
#   1. Connect to the server
#   2. Update the code
#   3. Rebuild and restart the app
#   4. Configure nginx for this site

set -e

SERVER_IP="213.199.45.126"
SERVER_USER="root"
APP_DIR="/var/www/blackmossandherbs-platform"
APP_PORT="3005"

echo "🌿 Black Moss & Herbs - Quick Deploy"
echo "======================================"
echo "Server: $SERVER_IP"
echo "App Port: $APP_PORT"
echo ""

# Check SSH connection
echo "📡 Connecting to server..."
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'Connected!'" || {
    echo "❌ Cannot connect to server."
    echo ""
    echo "Please ensure you have SSH access. Run:"
    echo "  ssh-copy-id $SERVER_USER@$SERVER_IP"
    echo ""
    echo "Or add your SSH key to the server."
    exit 1
}

echo "✅ Connected to server!"
echo ""

# Deploy the application
echo "🚀 Deploying application..."
ssh $SERVER_USER@$SERVER_IP << 'DEPLOY_EOF'
set -e

APP_DIR="/var/www/blackmossandherbs-platform"
APP_PORT="3005"

echo "📁 Navigating to app directory..."
cd $APP_DIR || {
    echo "App directory not found. Cloning repository..."
    cd /var/www
    git clone https://github.com/richhabits/blackmossandherbs-platform.git
    cd blackmossandherbs-platform
}

echo "📥 Pulling latest code..."
git fetch origin main
git reset --hard origin/main

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🏗️ Building application..."
npm run build

echo "🔄 Restarting application on port $APP_PORT..."
# Stop existing process if running
pm2 delete blackmossandherbs 2>/dev/null || true

# Start with the correct port
PORT=$APP_PORT pm2 start npm --name "blackmossandherbs" -- start
pm2 save

echo "⏳ Waiting for app to start..."
sleep 5

# Verify app is running
if curl -s http://127.0.0.1:$APP_PORT > /dev/null; then
    echo "✅ App is running on port $APP_PORT"
else
    echo "⚠️ App may not be responding yet. Check logs with: pm2 logs blackmossandherbs"
fi

echo ""
echo "🌐 Configuring Nginx..."

# Copy nginx config
cp config/blackmoss.nginx.conf /etc/nginx/sites-available/blackmoss.conf 2>/dev/null || \
cp config/blackmoss.nginx.conf /etc/nginx/conf.d/blackmoss.conf 2>/dev/null || true

# Enable site (for sites-available style)
if [ -d "/etc/nginx/sites-enabled" ]; then
    ln -sf /etc/nginx/sites-available/blackmoss.conf /etc/nginx/sites-enabled/blackmoss.conf 2>/dev/null || true
fi

# Test and reload nginx
nginx -t && systemctl reload nginx

echo "✅ Nginx configured!"

DEPLOY_EOF

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Your site should now be live at:"
echo "  http://blackmossandherbs.com"
echo "  http://www.blackmossandherbs.com"
echo "  http://$SERVER_IP (via port $APP_PORT)"
echo ""
echo "To enable HTTPS, run on the server:"
echo "  ssh $SERVER_USER@$SERVER_IP"
echo "  certbot --nginx -d blackmossandherbs.com -d www.blackmossandherbs.com"
echo ""
