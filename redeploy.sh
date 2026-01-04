#!/bin/bash

# Quick Redeploy Script - Pushes code and fixes deployment
# Run this from your local machine to redeploy to server

SERVER_IP="213.199.45.126"
SERVER_USER="root"
APP_DIR="/var/www/blackmossandherbs-platform"

echo "🚀 Black Moss & Herbs - Quick Redeploy"
echo "======================================"
echo "Server: $SERVER_IP"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Test SSH connection
echo -e "${YELLOW}Testing SSH connection...${NC}"
if ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'Connected'" &>/dev/null; then
    echo -e "${RED}❌ Cannot connect to server!${NC}"
    echo "Please ensure:"
    echo "  1. SSH access is configured"
    echo "  2. Server is accessible"
    echo "  3. You have the correct SSH key/password"
    exit 1
fi
echo -e "${GREEN}✓ SSH connection successful${NC}"
echo ""

# Upload fix script
echo -e "${YELLOW}Uploading fix script...${NC}"
scp -o StrictHostKeyChecking=no fix-deployment.sh $SERVER_USER@$SERVER_IP:/tmp/
echo -e "${GREEN}✓ Script uploaded${NC}"
echo ""

# Run fix script on server
echo -e "${YELLOW}Running deployment fix on server...${NC}"
ssh $SERVER_USER@$SERVER_IP "chmod +x /tmp/fix-deployment.sh && /tmp/fix-deployment.sh"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 REDEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your site should now be live at:"
echo "  http://blackmossandherbs.com"
echo "  http://213.199.45.126"
echo ""
echo "To check status, SSH into server and run:"
echo "  pm2 status"
echo "  systemctl status nginx"
echo ""
