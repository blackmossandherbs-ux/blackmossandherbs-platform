#!/bin/bash

# Comprehensive Fix Script for Black Moss & Herbs Deployment
# This fixes port conflicts, nginx configs, and ensures the site is live

set -e

echo "🔧 Black Moss & Herbs - Deployment Fix Script"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

DOMAIN="blackmossandherbs.com"
APP_DIR="/var/www/blackmossandherbs-platform"
APP_PORT="3000"

echo -e "${YELLOW}Step 1: Checking current deployment status...${NC}"

# Check if Docker is running
if docker ps | grep -q blackmoss; then
    echo -e "${GREEN}Docker containers found${NC}"
    DEPLOYMENT_METHOD="docker"
    APP_PORT="3005"  # Docker maps to 3005
elif pm2 list | grep -q blackmossandherbs; then
    echo -e "${GREEN}PM2 process found${NC}"
    DEPLOYMENT_METHOD="pm2"
    APP_PORT="3000"
else
    echo -e "${YELLOW}No running application found. Will deploy with PM2.${NC}"
    DEPLOYMENT_METHOD="pm2"
    APP_PORT="3000"
fi

echo -e "${GREEN}Detected deployment method: $DEPLOYMENT_METHOD${NC}"
echo -e "${GREEN}App should be on port: $APP_PORT${NC}"
echo ""

# Stop conflicting services
echo -e "${YELLOW}Step 2: Stopping conflicting services...${NC}"
if [ "$DEPLOYMENT_METHOD" == "docker" ]; then
    pm2 delete blackmossandherbs 2>/dev/null || true
elif [ "$DEPLOYMENT_METHOD" == "pm2" ]; then
    cd $APP_DIR 2>/dev/null && docker-compose down 2>/dev/null || true
fi
echo -e "${GREEN}✓ Conflicts resolved${NC}"
echo ""

# Ensure app directory exists
if [ ! -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Step 3: Cloning repository...${NC}"
    mkdir -p /var/www
    cd /var/www
    git clone https://github.com/richhabits/blackmossandherbs-platform.git || {
        echo -e "${YELLOW}Repository exists, pulling latest...${NC}"
        cd blackmossandherbs-platform
        git pull origin main
    }
else
    echo -e "${YELLOW}Step 3: Updating repository...${NC}"
    cd $APP_DIR
    git pull origin main || echo "Git pull failed, continuing..."
fi
echo -e "${GREEN}✓ Repository ready${NC}"
echo ""

# Check .env file
echo -e "${YELLOW}Step 4: Checking environment configuration...${NC}"
cd $APP_DIR
if [ ! -f .env ]; then
    echo -e "${RED}.env file not found!${NC}"
    echo -e "${YELLOW}Creating from template...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  Please edit .env file with your credentials!${NC}"
    echo -e "${YELLOW}Press Enter after editing .env to continue...${NC}"
    read
fi
echo -e "${GREEN}✓ Environment file ready${NC}"
echo ""

# Deploy based on method
if [ "$DEPLOYMENT_METHOD" == "docker" ]; then
    echo -e "${YELLOW}Step 5: Deploying with Docker...${NC}"
    cd $APP_DIR
    
    # Install Docker if not installed
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
    fi
    
    # Install Docker Compose if not installed
    if ! command -v docker-compose &> /dev/null; then
        echo "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    # Build and start
    docker-compose down
    docker-compose up -d --build
    
    # Wait for database
    echo "Waiting for database..."
    sleep 10
    
    # Run migrations
    docker-compose exec -T blackmoss-app-service npx prisma generate || true
    docker-compose exec -T blackmoss-app-service npx prisma db push || true
    
    APP_PORT="3005"
    
elif [ "$DEPLOYMENT_METHOD" == "pm2" ]; then
    echo -e "${YELLOW}Step 5: Deploying with PM2...${NC}"
    cd $APP_DIR
    
    # Install Node.js if not installed
    if ! command -v node &> /dev/null; then
        echo "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi
    
    # Install PM2 if not installed
    if ! command -v pm2 &> /dev/null; then
        echo "Installing PM2..."
        npm install -g pm2
    fi
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install
    
    # Generate Prisma client
    echo "Generating Prisma client..."
    npx prisma generate
    
    # Run migrations
    echo "Running database migrations..."
    npx prisma db push || echo "Migration failed, continuing..."
    
    # Build application
    echo "Building application..."
    npm run build
    
    # Stop existing PM2 process
    pm2 delete blackmossandherbs 2>/dev/null || true
    
    # Start with PM2
    echo "Starting application..."
    pm2 start npm --name "blackmossandherbs" -- start
    pm2 save
    
    # Setup PM2 startup
    pm2 startup | tail -n 1 | bash 2>/dev/null || true
    
    APP_PORT="3000"
fi

echo -e "${GREEN}✓ Application deployed${NC}"
echo ""

# Configure Nginx
echo -e "${YELLOW}Step 6: Configuring Nginx...${NC}"

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt update
    apt install -y nginx
fi

# Create proper nginx config
cat > /etc/nginx/sites-available/blackmossandherbs << NGINXEOF
# Black Moss & Herbs - Main Site Configuration
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Allow Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Proxy to application
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Redirect other domains to main domain
server {
    listen 80;
    server_name blackmossandherbs.co.uk www.blackmossandherbs.co.uk;
    return 301 http://$DOMAIN\$request_uri;
}

server {
    listen 80;
    server_name blackmossandherbs.info www.blackmossandherbs.info;
    return 301 http://$DOMAIN\$request_uri;
}
NGINXEOF

# Enable site
ln -sf /etc/nginx/sites-available/blackmossandherbs /etc/nginx/sites-enabled/

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Restart nginx
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✓ Nginx configured${NC}"
echo ""

# Check if app is responding
echo -e "${YELLOW}Step 7: Verifying deployment...${NC}"
sleep 5

if curl -s -o /dev/null -w "%{http_code}" http://localhost:$APP_PORT | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ Application is responding on port $APP_PORT${NC}"
else
    echo -e "${RED}⚠️  Application may not be responding on port $APP_PORT${NC}"
    echo -e "${YELLOW}Checking logs...${NC}"
    if [ "$DEPLOYMENT_METHOD" == "pm2" ]; then
        pm2 logs blackmossandherbs --lines 20 --nostream
    else
        docker-compose logs --tail=20
    fi
fi

# Check nginx
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx is running${NC}"
else
    echo -e "${RED}⚠️  Nginx is not running${NC}"
    systemctl start nginx
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT FIX COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your site should now be accessible at:"
echo "  http://$DOMAIN"
echo "  http://213.199.45.126"
echo ""
echo "Application Status:"
if [ "$DEPLOYMENT_METHOD" == "pm2" ]; then
    pm2 status
    echo ""
    echo "View logs: pm2 logs blackmossandherbs"
else
    docker-compose ps
    echo ""
    echo "View logs: docker-compose logs -f"
fi
echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager -l | head -n 5
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Point your domain DNS A record to: 213.199.45.126"
echo "2. Install SSL certificate:"
echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "3. Test your site: http://$DOMAIN"
echo ""
