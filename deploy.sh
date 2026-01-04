#!/bin/bash

# Black Moss & Herbs - Deployment Script
# For self-hosted servers

set -e

echo "🌿 Black Moss & Herbs - Deployment Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Get deployment method
echo "Choose deployment method:"
echo "1) Docker (Recommended)"
echo "2) PM2 (Node.js Process Manager)"
read -p "Enter choice (1 or 2): " DEPLOY_METHOD

if [ "$DEPLOY_METHOD" == "1" ]; then
    echo -e "${GREEN}Deploying with Docker...${NC}"
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}Docker not found. Installing...${NC}"
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${YELLOW}Docker Compose not found. Installing...${NC}"
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    # Check for .env file
    if [ ! -f .env ]; then
        echo -e "${YELLOW}.env file not found. Creating from template...${NC}"
        cp .env.example .env
        echo -e "${RED}Please edit .env file with your credentials before continuing!${NC}"
        exit 1
    fi
    
    # Build and start containers
    echo -e "${GREEN}Building and starting containers...${NC}"
    docker-compose down
    docker-compose up -d --build
    
    # Wait for database
    echo -e "${YELLOW}Waiting for database to be ready...${NC}"
    sleep 10
    
    # Run migrations
    echo -e "${GREEN}Running database migrations...${NC}"
    docker-compose exec blackmoss-app-service npx prisma generate
    docker-compose exec blackmoss-app-service npx prisma db push
    
    echo -e "${GREEN}✅ Deployment complete!${NC}"
    echo -e "Your app is running on port 3005 (mapped to container port 3000)"
    echo -e "Check status: ${YELLOW}docker-compose ps${NC}"
    echo -e "View logs: ${YELLOW}docker-compose logs -f${NC}"
    
elif [ "$DEPLOY_METHOD" == "2" ]; then
    echo -e "${GREEN}Deploying with PM2...${NC}"
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}Node.js not found. Installing...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}PM2 not found. Installing...${NC}"
        npm install -g pm2
    fi
    
    # Check for .env file
    if [ ! -f .env ]; then
        echo -e "${YELLOW}.env file not found. Creating from template...${NC}"
        cp .env.example .env
        echo -e "${RED}Please edit .env file with your credentials before continuing!${NC}"
        exit 1
    fi
    
    # Install dependencies
    echo -e "${GREEN}Installing dependencies...${NC}"
    npm install
    
    # Generate Prisma client
    echo -e "${GREEN}Generating Prisma client...${NC}"
    npx prisma generate
    
    # Run migrations
    echo -e "${GREEN}Running database migrations...${NC}"
    npx prisma db push
    
    # Build application
    echo -e "${GREEN}Building application...${NC}"
    npm run build
    
    # Stop existing PM2 process if running
    pm2 delete blackmossandherbs 2>/dev/null || true
    
    # Start with PM2
    echo -e "${GREEN}Starting application with PM2...${NC}"
    pm2 start npm --name "blackmossandherbs" -- start
    pm2 save
    
    # Setup PM2 startup
    pm2 startup
    
    echo -e "${GREEN}✅ Deployment complete!${NC}"
    echo -e "Your app is running on port 3000"
    echo -e "Check status: ${YELLOW}pm2 status${NC}"
    echo -e "View logs: ${YELLOW}pm2 logs blackmossandherbs${NC}"
    
else
    echo -e "${RED}Invalid choice${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure Nginx as reverse proxy"
echo "2. Set up SSL with Let's Encrypt"
echo "3. Configure your domain DNS"
echo ""
echo -e "${GREEN}See DEPLOYMENT.md for detailed instructions${NC}"
