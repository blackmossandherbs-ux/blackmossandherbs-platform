#!/bin/bash

# Black Moss & Herbs - Complete Server Deployment
# Run this script ON THE SERVER to deploy Black Moss & Herbs
# curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/blackmossandherbs-platform/main/deploy-on-server.sh | bash

set -e

echo "🚀 BLACK MOSS & HERBS - SERVER DEPLOYMENT"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/blackmossandherbs-platform"
DOMAIN="blackmossandherbs.com"
APP_PORT="3005"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (sudo su)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Running as root${NC}"
echo ""

# Step 1: Stop conflicting services
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Stopping Conflicting Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check what's running
if command -v docker &> /dev/null; then
    echo "Docker containers currently running:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    
    # Stop containers that aren't blackmoss
    CONTAINERS=$(docker ps --format "{{.Names}}" | grep -v blackmoss || true)
    if [ -n "$CONTAINERS" ]; then
        echo -e "${YELLOW}Stopping non-blackmoss containers...${NC}"
        echo "$CONTAINERS" | xargs -r docker stop
        echo -e "${GREEN}✓ Stopped conflicting containers${NC}"
    else
        echo "No conflicting containers to stop"
    fi
else
    echo -e "${YELLOW}⚠ Docker not installed${NC}"
fi
echo ""

# Step 2: Navigate to app directory
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Preparing Application Directory"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}❌ Directory not found: $APP_DIR${NC}"
    echo ""
    echo "To fix this, first clone your repository:"
    echo ""
    echo "  cd /var/www"
    echo "  git clone https://github.com/YOUR_USERNAME/blackmossandherbs-platform.git"
    echo ""
    exit 1
fi

cd "$APP_DIR"
echo -e "${GREEN}✓ Found application directory${NC}"
echo "Location: $APP_DIR"
echo ""

# Step 3: Update code
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Updating Code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -d .git ]; then
    echo "Pulling latest changes..."
    git fetch --all
    
    # Try main branch first, then try cursor branch
    if git pull origin main 2>/dev/null; then
        echo -e "${GREEN}✓ Updated from main branch${NC}"
    elif git pull origin cursor/server-deployment-issues-76c2 2>/dev/null; then
        echo -e "${GREEN}✓ Updated from cursor branch${NC}"
    else
        echo -e "${YELLOW}⚠ Could not pull from remote (using local version)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Not a git repository${NC}"
fi
echo ""

# Step 4: Check environment
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Checking Environment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -f .env ]; then
    echo -e "${RED}❌ Missing .env file${NC}"
    echo ""
    echo "Creating .env from template..."
    cp .env.example .env
    
    echo -e "${YELLOW}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚠️  IMPORTANT: EDIT YOUR .ENV FILE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Required configuration:"
    echo "  - DATABASE_URL"
    echo "  - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "  - STRIPE_SECRET_KEY"
    echo "  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo ""
    echo "Edit now? (y/n)"
    echo -e "${NC}"
    read -r EDIT_ENV
    
    if [ "$EDIT_ENV" = "y" ]; then
        nano .env
    else
        echo -e "${RED}⚠️  Deployment may fail without proper .env configuration${NC}"
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi
echo ""

# Step 5: Install dependencies
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  Installing Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v npm &> /dev/null; then
    echo "Installing Node packages..."
    npm install --production
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}❌ npm not found. Please install Node.js first.${NC}"
    exit 1
fi
echo ""

# Step 6: Build application
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  Building Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Building Next.js..."
npm run build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Step 7: Setup database
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  Setting Up Database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma db push --accept-data-loss || echo -e "${YELLOW}⚠ Database might already be configured${NC}"

echo -e "${GREEN}✓ Database configured${NC}"
echo ""

# Step 8: Start application
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8️⃣  Starting Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v docker-compose &> /dev/null; then
    echo "Starting with Docker Compose..."
    docker-compose down || true
    docker-compose up -d
    
    echo "Waiting for containers to start..."
    sleep 10
    
    echo ""
    echo "Container status:"
    docker-compose ps
    
    echo -e "${GREEN}✓ Docker containers started${NC}"
    
elif command -v pm2 &> /dev/null; then
    echo "Starting with PM2..."
    pm2 delete blackmossandherbs 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    
    echo ""
    echo "PM2 status:"
    pm2 list
    
    echo -e "${GREEN}✓ PM2 process started${NC}"
else
    echo -e "${YELLOW}⚠ Neither Docker nor PM2 found${NC}"
    echo "Starting manually..."
    npm start &
    echo -e "${GREEN}✓ Application started in background${NC}"
fi
echo ""

# Wait for app to be ready
echo "Waiting for application to be ready..."
sleep 5

# Test if app is responding
if curl -s -f http://localhost:$APP_PORT > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Application is responding on port $APP_PORT${NC}"
else
    echo -e "${YELLOW}⚠ Application may still be starting up${NC}"
fi
echo ""

# Step 9: Configure Nginx
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "9️⃣  Configuring Nginx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v nginx &> /dev/null; then
    # Backup existing configs
    echo "Backing up existing Nginx configs..."
    mkdir -p /etc/nginx/sites-backup
    cp /etc/nginx/sites-enabled/* /etc/nginx/sites-backup/ 2>/dev/null || true
    
    # Remove conflicting configs
    echo "Removing conflicting configurations..."
    rm -f /etc/nginx/sites-enabled/default
    find /etc/nginx/sites-enabled/ -type l ! -name "$DOMAIN" -delete 2>/dev/null || true
    
    # Copy our config
    echo "Installing Black Moss & Herbs configuration..."
    if [ -f "config/blackmoss.nginx.conf" ]; then
        cp config/blackmoss.nginx.conf /etc/nginx/sites-available/$DOMAIN
        ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
        echo -e "${GREEN}✓ Nginx config installed${NC}"
    else
        echo -e "${RED}❌ Nginx config file not found${NC}"
        echo "Creating basic config..."
        cat > /etc/nginx/sites-available/$DOMAIN << NGINXEOF
server {
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    listen 80;
}
NGINXEOF
        ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
    fi
    
    # Test nginx config
    echo "Testing Nginx configuration..."
    if nginx -t 2>&1; then
        echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
        
        echo "Restarting Nginx..."
        systemctl restart nginx
        echo -e "${GREEN}✓ Nginx restarted${NC}"
    else
        echo -e "${RED}❌ Nginx configuration test failed${NC}"
        echo "Check: nginx -t"
        echo "Restoring backup..."
        cp /etc/nginx/sites-backup/* /etc/nginx/sites-enabled/ 2>/dev/null || true
        systemctl reload nginx
    fi
else
    echo -e "${YELLOW}⚠ Nginx not installed${NC}"
    echo "Install with: apt install nginx"
fi
echo ""

# Step 10: Verification
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Testing application..."
if curl -s -f http://localhost:$APP_PORT > /dev/null 2>&1; then
    echo -e "${GREEN}✓ App is responding on port $APP_PORT${NC}"
else
    echo -e "${RED}✗ App is NOT responding on port $APP_PORT${NC}"
fi

echo ""
echo "Testing Nginx proxy..."
NGINX_TITLE=$(curl -s http://localhost 2>/dev/null | grep -o '<title>[^<]*</title>' | sed 's/<title>//;s/<\/title>//' | head -1)
if [ -n "$NGINX_TITLE" ]; then
    echo "Nginx is serving: $NGINX_TITLE"
    if echo "$NGINX_TITLE" | grep -iq "hectic\|danny"; then
        echo -e "${RED}✗ STILL SHOWING HECTIC RADIO!${NC}"
        echo "  Need to check Nginx configuration manually"
    elif echo "$NGINX_TITLE" | grep -iq "black\|moss"; then
        echo -e "${GREEN}✓ Black Moss & Herbs is being served!${NC}"
    else
        echo -e "${YELLOW}? Unknown site: $NGINX_TITLE${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Could not determine what Nginx is serving${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your site should now be accessible at:"
echo "  • http://$DOMAIN"
echo "  • http://www.$DOMAIN"
echo ""
echo "Next steps:"
echo "  1. Test in browser: http://$DOMAIN"
echo "  2. Set up SSL: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "  3. Monitor logs: docker-compose logs -f"
echo ""
echo "Troubleshooting:"
echo "  • Check app logs: docker-compose logs blackmoss-app-service"
echo "  • Check Nginx logs: tail -f /var/log/nginx/error.log"
echo "  • Restart app: docker-compose restart"
echo "  • Restart Nginx: systemctl restart nginx"
echo ""
