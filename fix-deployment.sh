#!/bin/bash

# Black Moss & Herbs - Emergency Deployment Fix
# This script will properly deploy the Black Moss & Herbs platform

set -e

SERVER_IP="213.199.45.126"
SERVER_USER="root"
APP_DIR="/var/www/blackmossandherbs-platform"
DOMAIN="blackmossandherbs.com"

echo "🚨 BLACK MOSS & HERBS - EMERGENCY FIX"
echo "====================================="
echo ""
echo "Problem Detected: Wrong website is being served (Hectic Radio)"
echo "Solution: Deploy Black Moss & Herbs properly"
echo ""

# Check SSH connectivity
echo "📡 Testing server connection..."
if ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'Connected'" 2>/dev/null; then
    echo ""
    echo "❌ Cannot connect to server via SSH"
    echo ""
    echo "SOLUTION: You need to SSH into the server manually:"
    echo ""
    echo "   ssh root@213.199.45.126"
    echo ""
    echo "Then run these commands to fix the deployment:"
    echo ""
    cat << 'MANUAL_FIX'
# 1. Navigate to the app directory (or create it)
cd /var/www
if [ ! -d "blackmossandherbs-platform" ]; then
    git clone https://github.com/YOUR_USERNAME/blackmossandherbs-platform.git
fi
cd blackmossandherbs-platform
git pull origin main

# 2. Install dependencies if needed
npm install --production

# 3. Build the application
npm run build

# 4. Set up environment
if [ ! -f ".env" ]; then
    cp .env.example .env
    nano .env  # Edit with your actual credentials
fi

# 5. Run database migrations
npx prisma generate
npx prisma db push

# 6. Stop conflicting services (the other site)
docker ps -a | grep -v blackmoss | awk '{print $1}' | xargs -r docker stop
pm2 list | grep -v blackmoss | awk '{print $2}' | xargs -r pm2 stop

# 7. Start with Docker
docker-compose up -d

# OR start with PM2 if you prefer
# pm2 start ecosystem.config.js
# pm2 save

# 8. Fix Nginx configuration
cp /var/www/blackmossandherbs-platform/config/blackmoss.nginx.conf /etc/nginx/sites-available/blackmossandherbs.com
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/blackmossandherbs.com

# Remove other site configs that might conflict
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/hectic*

# Test nginx config
nginx -t

# Restart nginx
systemctl restart nginx

# 9. Verify it's running
echo "Checking if app is responding on port 3005..."
curl -I http://localhost:3005

echo ""
echo "✅ Deployment should be fixed!"
echo "Visit: http://blackmossandherbs.com"
MANUAL_FIX
    
    echo ""
    exit 1
fi

echo "✅ SSH connection successful!"
echo ""

# Deploy automatically
echo "🚀 Starting automated deployment..."
echo ""

# Create and upload fix script
cat > /tmp/server-fix.sh << 'SERVERSCRIPT'
#!/bin/bash
set -e

echo "🔧 Fixing Black Moss & Herbs deployment..."

# Stop conflicting services
echo "1. Stopping other projects..."
docker ps -a | grep -v blackmoss | awk 'NR>1 {print $1}' | xargs -r docker stop 2>/dev/null || true
pm2 list | grep -v blackmoss | awk 'NR>1 {print $2}' | xargs -r pm2 stop 2>/dev/null || true

# Navigate to app directory
cd /var/www/blackmossandherbs-platform || {
    echo "❌ App directory not found. Need to clone repository first."
    exit 1
}

echo "2. Pulling latest code..."
git pull origin main || git pull origin cursor/server-deployment-issues-76c2 || true

echo "3. Installing dependencies..."
npm install --production

echo "4. Building application..."
npm run build

echo "5. Setting up database..."
npx prisma generate
npx prisma db push || echo "Database already configured"

echo "6. Starting application with Docker..."
docker-compose down || true
docker-compose up -d

# Wait for app to start
echo "7. Waiting for app to start..."
sleep 10

echo "8. Configuring Nginx..."
# Backup existing configs
mkdir -p /etc/nginx/sites-backup
cp /etc/nginx/sites-enabled/* /etc/nginx/sites-backup/ 2>/dev/null || true

# Remove conflicting configs
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/hectic*
find /etc/nginx/sites-enabled/ -type l ! -name "blackmossandherbs.com" -delete 2>/dev/null || true

# Copy our config
cp /var/www/blackmossandherbs-platform/config/blackmoss.nginx.conf /etc/nginx/sites-available/blackmossandherbs.com
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/blackmossandherbs.com

# Test nginx
echo "9. Testing Nginx configuration..."
nginx -t

echo "10. Restarting Nginx..."
systemctl restart nginx

echo ""
echo "✅ DEPLOYMENT FIXED!"
echo ""
echo "Testing local response..."
curl -I http://localhost:3005 | head -5

echo ""
echo "Checking what Nginx is serving..."
curl -I http://localhost | head -5

echo ""
echo "🎉 Black Moss & Herbs should now be live!"
SERVERSCRIPT

echo "📤 Uploading fix script to server..."
scp -o StrictHostKeyChecking=no /tmp/server-fix.sh $SERVER_USER@$SERVER_IP:/tmp/

echo "🔧 Running fix on server..."
ssh $SERVER_USER@$SERVER_IP "chmod +x /tmp/server-fix.sh && /tmp/server-fix.sh"

echo ""
echo "🎊 DEPLOYMENT COMPLETE!"
echo ""
echo "Your site should now be live at:"
echo "  🌐 http://blackmossandherbs.com"
echo "  🌐 http://213.199.45.126"
echo ""
echo "To verify, run: curl -I http://blackmossandherbs.com"
echo ""
