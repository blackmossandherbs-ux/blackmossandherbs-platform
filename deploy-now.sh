#!/bin/bash

# BLACK MOSS & HERBS - ONE-COMMAND DEPLOYMENT
# Run this ON THE SERVER to deploy or update the site

set -e

PROJECT="Black Moss & Herbs"
PORT=3005

echo "🚀 $PROJECT - Quick Deploy"
echo "================================"
echo ""

# Must be in project directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Must run from project directory"
    echo "   cd /var/www/blackmossandherbs-platform"
    exit 1
fi

# Pull latest code
echo "📥 Pulling latest code..."
git pull || echo "⚠️  Using local version"

# Check .env
if [ ! -f ".env" ]; then
    echo "❌ Missing .env file!"
    echo "   Copy .env.example and configure it first"
    exit 1
fi

# Install & build
echo "📦 Installing dependencies..."
npm install --production --quiet

echo "🔨 Building application..."
npm run build

# Database
echo "🗄️  Setting up database..."
npx prisma generate > /dev/null
npx prisma db push --accept-data-loss 2>/dev/null || true

# Deploy with Docker
echo "🐳 Deploying containers..."
docker-compose down
docker-compose up -d --build

echo "⏳ Waiting for startup..."
sleep 10

# Check if running
if curl -s -f http://localhost:$PORT > /dev/null 2>&1; then
    echo "✅ App is running on port $PORT"
else
    echo "❌ App not responding on port $PORT"
    echo ""
    echo "Check logs: docker-compose logs -f"
    exit 1
fi

# Configure Nginx
if [ -f "config/blackmoss.nginx.conf" ] && [ -d "/etc/nginx" ]; then
    echo "🌐 Configuring Nginx..."
    
    rm -f /etc/nginx/sites-enabled/default
    cp config/blackmoss.nginx.conf /etc/nginx/sites-available/blackmossandherbs.com
    ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/
    
    if nginx -t 2>&1 > /dev/null; then
        systemctl restart nginx
        echo "✅ Nginx configured"
    else
        echo "⚠️  Nginx config error (app still running)"
    fi
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "Your site is live:"
echo "  • http://blackmossandherbs.com"
echo "  • http://$(hostname -I | awk '{print $1}'):3005"
echo ""
echo "Useful commands:"
echo "  • View logs: docker-compose logs -f"
echo "  • Check status: docker ps"
echo "  • Restart: docker-compose restart"
echo "  • Stop: docker-compose down"
echo ""
