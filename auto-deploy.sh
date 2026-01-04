#!/bin/bash

# One-Command Server Setup for 213.199.45.126
# This script does EVERYTHING automatically

SERVER="213.199.45.126"

echo "🚀 Black Moss & Herbs - Automated Server Setup"
echo "Server: $SERVER"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}This will:${NC}"
echo "  1. Install Node.js, PostgreSQL, Nginx, PM2"
echo "  2. Clone the repository"
echo "  3. Set up the database"
echo "  4. Deploy the application"
echo "  5. Configure Nginx"
echo ""
read -p "Continue? (y/n): " CONTINUE

if [ "$CONTINUE" != "y" ]; then
    echo "Aborted."
    exit 0
fi

# Get configuration
echo ""
echo "=== Configuration ==="
read -p "Database password: " DB_PASS
read -p "Your domain (or press Enter to use IP): " DOMAIN
DOMAIN=${DOMAIN:-$SERVER}
read -p "Stripe publishable key: " STRIPE_PUB
read -sp "Stripe secret key: " STRIPE_SECRET
echo ""

# Generate NextAuth secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)

echo ""
echo -e "${GREEN}Starting deployment...${NC}"
echo ""

# Create deployment script on server
ssh root@$SERVER 'bash -s' << ENDSSH
#!/bin/bash
set -e

echo "📦 Updating system..."
apt update && apt upgrade -y

echo "🔧 Installing dependencies..."
apt install -y curl wget git ufw

echo "🔥 Configuring firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 3005
echo "y" | ufw enable

echo "📗 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo "🐘 Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

echo "🌐 Installing Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

echo "⚙️ Installing PM2..."
npm install -g pm2

echo "🗄️ Setting up database..."
sudo -u postgres psql << EOF
CREATE DATABASE blackmossandherbs;
CREATE USER dbuser WITH PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE blackmossandherbs TO dbuser;
ALTER DATABASE blackmossandherbs OWNER TO dbuser;
\q
EOF

echo "📦 Cloning repository..."
mkdir -p /var/www
cd /var/www
if [ -d "blackmossandherbs-platform" ]; then
    cd blackmossandherbs-platform
    git pull origin main
else
    git clone https://github.com/richhabits/blackmossandherbs-platform.git
    cd blackmossandherbs-platform
fi

echo "📝 Creating environment file..."
cat > .env << EOF
DATABASE_URL="postgresql://dbuser:$DB_PASS@localhost:5432/blackmossandherbs"
NEXTAUTH_URL="http://$DOMAIN"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$STRIPE_PUB"
STRIPE_SECRET_KEY="$STRIPE_SECRET"
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_APP_URL="http://$DOMAIN"
EOF

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️ Setting up database schema..."
npx prisma db push

echo "🌱 Seeding database..."
npm run db:seed || echo "Seeding skipped (optional)"

echo "🏗️ Building application..."
npm run build

echo "🚀 Starting application with PM2 on port 3005..."
pm2 delete blackmossandherbs 2>/dev/null || true
PORT=3005 pm2 start npm --name "blackmossandherbs" -- start
pm2 save
pm2 startup | tail -n 1 | bash

echo "🌐 Configuring Nginx (port 3005 to avoid conflicts with other sites)..."
cat > /etc/nginx/sites-available/blackmossandherbs << 'NGINXEOF'
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/blackmossandherbs /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "Your site is now live at:"
echo "  http://$DOMAIN"
echo "  http://$SERVER"
echo ""
echo "Application status:"
pm2 status
echo ""
echo "Next steps:"
echo "  1. Point your domain DNS to $SERVER"
echo "  2. Install SSL: apt install certbot python3-certbot-nginx && certbot --nginx -d $DOMAIN"
echo ""
ENDSSH

echo ""
echo -e "${GREEN}🎉 Server setup complete!${NC}"
echo ""
echo "Your Black Moss & Herbs platform is now running!"
echo ""
echo "Access it at:"
echo "  http://$SERVER"
if [ "$DOMAIN" != "$SERVER" ]; then
    echo "  http://$DOMAIN (after DNS setup)"
fi
echo ""
