#!/bin/bash

# Remote Server Deployment Script
# Deploys to 213.199.45.126

SERVER_IP="213.199.45.126"
SERVER_USER="root"
APP_DIR="/var/www/blackmossandherbs-platform"

echo "🚀 Deploying Black Moss & Herbs to $SERVER_IP"
echo "=============================================="
echo ""

# Test SSH connection
echo "Testing SSH connection..."
ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'Connection successful!'" || {
    echo "❌ Cannot connect to server. Please ensure:"
    echo "  1. SSH is enabled on the server"
    echo "  2. You have SSH key access or password"
    echo "  3. Server is accessible from your network"
    exit 1
}

echo "✅ SSH connection successful!"
echo ""

# Upload setup script
echo "📤 Uploading setup script to server..."
scp -o StrictHostKeyChecking=no setup-server.sh $SERVER_USER@$SERVER_IP:/tmp/

# Run server setup
echo "🔧 Running server setup..."
ssh $SERVER_USER@$SERVER_IP "cd /tmp && chmod +x setup-server.sh && ./setup-server.sh"

# Clone repository
echo "📦 Cloning repository..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
cd /var/www
if [ -d "blackmossandherbs-platform" ]; then
    echo "Repository already exists, pulling latest..."
    cd blackmossandherbs-platform
    git pull origin main
else
    echo "Cloning repository..."
    git clone https://github.com/richhabits/blackmossandherbs-platform.git
    cd blackmossandherbs-platform
fi
EOF

# Upload environment file
echo "📝 Setting up environment..."
read -p "Do you want to configure environment now? (y/n): " CONFIGURE_ENV

if [ "$CONFIGURE_ENV" == "y" ]; then
    echo "Creating .env file..."
    
    # Get database credentials
    read -p "Database user (default: dbuser): " DB_USER
    DB_USER=${DB_USER:-dbuser}
    
    read -sp "Database password: " DB_PASS
    echo ""
    
    read -p "Database name (default: blackmossandherbs): " DB_NAME
    DB_NAME=${DB_NAME:-blackmossandherbs}
    
    # Get NextAuth secret
    echo "Generating NextAuth secret..."
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    # Get domain
    read -p "Your domain (e.g., blackmossandherbs.com): " DOMAIN
    DOMAIN=${DOMAIN:-$SERVER_IP}
    
    # Get Stripe keys
    read -p "Stripe publishable key: " STRIPE_PUB
    read -sp "Stripe secret key: " STRIPE_SECRET
    echo ""
    
    # Create .env file
    cat > /tmp/.env << ENVEOF
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
NEXTAUTH_URL="http://$DOMAIN"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$STRIPE_PUB"
STRIPE_SECRET_KEY="$STRIPE_SECRET"
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_APP_URL="http://$DOMAIN"
ENVEOF
    
    # Upload .env
    scp /tmp/.env $SERVER_USER@$SERVER_IP:$APP_DIR/.env
    rm /tmp/.env
    
    echo "✅ Environment configured!"
fi

# Run deployment
echo "🚀 Running deployment..."
ssh $SERVER_USER@$SERVER_IP "cd $APP_DIR && chmod +x deploy.sh && ./deploy.sh"

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Your site should be accessible at:"
echo "  http://$SERVER_IP:3000 (PM2) or http://$SERVER_IP:3005 (Docker)"
echo ""
echo "Next steps:"
echo "  1. Configure your domain DNS to point to $SERVER_IP"
echo "  2. Run SSL setup: ssh $SERVER_USER@$SERVER_IP 'cd $APP_DIR && ./setup-ssl.sh'"
echo "  3. Configure Nginx reverse proxy"
echo ""
