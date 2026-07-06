#!/bin/bash

# Server Setup Script
# Run this on a fresh Ubuntu server to install all dependencies

set -e

echo "🚀 Black Moss & Herbs - Server Setup"
echo "====================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential tools
echo "🔧 Installing essential tools..."
apt install -y curl wget git ufw

# Setup firewall
echo "🔥 Configuring firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Install Node.js 18
echo "📗 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Install Nginx
echo "🌐 Installing Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Install Docker (optional)
read -p "Install Docker? (y/n): " INSTALL_DOCKER
if [ "$INSTALL_DOCKER" == "y" ]; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Install PM2 (optional)
read -p "Install PM2? (y/n): " INSTALL_PM2
if [ "$INSTALL_PM2" == "y" ]; then
    echo "⚙️ Installing PM2..."
    npm install -g pm2
fi

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www
cd /var/www

# Setup PostgreSQL database
echo "🗄️ Setting up PostgreSQL database..."
read -p "Create database now? (y/n): " CREATE_DB
if [ "$CREATE_DB" == "y" ]; then
    read -p "Database name (default: blackmossandherbs): " DB_NAME
    DB_NAME=${DB_NAME:-blackmossandherbs}
    
    read -p "Database user (default: dbuser): " DB_USER
    DB_USER=${DB_USER:-dbuser}
    
    read -sp "Database password: " DB_PASS
    echo ""
    
    sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\q
EOF
    
    echo "✅ Database created: $DB_NAME"
    echo "   User: $DB_USER"
fi

echo ""
echo "🎉 Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository: git clone https://github.com/richhabits/blackmossandherbs-platform.git"
echo "2. Configure environment variables"
echo "3. Run deployment script: ./deploy.sh"
echo "4. Setup SSL: ./setup-ssl.sh"
echo ""
echo "Installed:"
echo "  ✅ Node.js $(node --version)"
echo "  ✅ npm $(npm --version)"
echo "  ✅ PostgreSQL"
echo "  ✅ Nginx"
if [ "$INSTALL_DOCKER" == "y" ]; then
    echo "  ✅ Docker $(docker --version)"
fi
if [ "$INSTALL_PM2" == "y" ]; then
    echo "  ✅ PM2 $(pm2 --version)"
fi
