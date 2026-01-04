#!/bin/bash

# 🚨 EMERGENCY: Run this ON THE SERVER to fix the deployment NOW
# wget https://raw.githubusercontent.com/YOUR_USERNAME/blackmossandherbs-platform/main/emergency-fix.sh && bash emergency-fix.sh

echo "🚨 EMERGENCY FIX - BLACK MOSS & HERBS"
echo "======================================"
echo ""

# Must run as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Must run as root. Use: sudo bash emergency-fix.sh"
    exit 1
fi

APP_DIR="/var/www/blackmossandherbs-platform"

# Check if directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Directory not found: $APP_DIR"
    echo ""
    echo "First, clone your repository:"
    echo "  cd /var/www"
    echo "  git clone YOUR_GITHUB_URL blackmossandherbs-platform"
    exit 1
fi

cd "$APP_DIR"

echo "Step 1: Stopping conflicting services..."
docker ps | grep -v blackmoss | awk 'NR>1 {print $1}' | xargs -r docker stop 2>/dev/null || true
pm2 list 2>/dev/null || true

echo ""
echo "Step 2: Starting Black Moss & Herbs..."
docker-compose down 2>/dev/null || true
docker-compose up -d

echo ""
echo "Step 3: Waiting for startup..."
sleep 15

echo ""
echo "Step 4: Configuring Nginx..."
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/*hectic* 2>/dev/null || true

# Create simple working config
cat > /etc/nginx/sites-available/blackmossandherbs.com << 'EOF'
server {
    server_name blackmossandherbs.com www.blackmossandherbs.com;
    
    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    listen 80;
}
EOF

ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/blackmossandherbs.com

echo ""
echo "Step 5: Testing Nginx..."
nginx -t

echo ""
echo "Step 6: Restarting Nginx..."
systemctl restart nginx

echo ""
echo "Step 7: Verification..."
sleep 3

echo "Checking port 3005..."
curl -I http://localhost:3005 2>/dev/null | head -3

echo ""
echo "Checking what Nginx is serving..."
curl -s http://localhost 2>/dev/null | grep -i "title" | head -3

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "Test now: curl http://blackmossandherbs.com | grep -i title"
echo "Or visit: http://blackmossandherbs.com"
echo ""
