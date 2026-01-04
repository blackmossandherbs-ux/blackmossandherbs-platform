# Self-Hosted Server Deployment Guide

## 🏠 Deploy to Your Own Server

This guide shows you how to deploy Black Moss & Herbs to your own server (VPS, dedicated server, etc.) without any expensive third-party services.

## Prerequisites

- Linux server (Ubuntu 20.04+ recommended)
- Root or sudo access
- Domain name pointed to your server
- At least 2GB RAM, 20GB storage

## Option 1: Docker Deployment (Recommended)

### Step 1: Install Docker on Server

```bash
# SSH into your server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Clone Repository on Server

```bash
cd /var/www
sudo git clone https://github.com/richhabits/blackmossandherbs-platform.git
cd blackmossandherbs-platform
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

Add your configuration:
```env
DATABASE_URL="postgresql://user:password@postgres:5432/blackmossandherbs"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Step 4: Deploy with Docker

```bash
# Build and start containers
sudo docker-compose up -d

# Check status
sudo docker-compose ps

# View logs
sudo docker-compose logs -f
```

Your site will be running on port **3005** (Docker host port mapped to container port 3000). Use Nginx as reverse proxy (see below).

## Option 2: PM2 Deployment (Node.js Process Manager)

### Step 1: Install Node.js and PM2

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### Step 2: Clone and Setup

```bash
cd /var/www
sudo git clone https://github.com/richhabits/blackmossandherbs-platform.git
cd blackmossandherbs-platform

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
nano .env

# Build for production
npm run build
```

### Step 3: Start with PM2

```bash
# Start application
pm2 start npm --name "blackmossandherbs" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it gives you

# Monitor
pm2 status
pm2 logs blackmossandherbs
```

## Nginx Configuration

### Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### Configure Nginx

Create config file:
```bash
sudo nano /etc/nginx/sites-available/blackmossandherbs
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        # Docker deploy uses host port 3005 -> container 3000 (see docker-compose.yml)
        # If you deploy via PM2 instead, change this to http://localhost:3000
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/blackmossandherbs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Certificate (Free with Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

## Database Setup (Self-Hosted PostgreSQL)

### Install PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE blackmossandherbs;
CREATE USER dbuser WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE blackmossandherbs TO dbuser;
\q
```

### Run Migrations

```bash
cd /var/www/blackmossandherbs-platform
npx prisma generate
npx prisma db push
```

## Deployment Script

Use the provided deploy script:

```bash
# Make executable
chmod +x deploy.sh

# Deploy
./deploy.sh
```

## Monitoring & Maintenance

### Check Application Status

```bash
# PM2
pm2 status
pm2 logs blackmossandherbs

# Docker
sudo docker-compose ps
sudo docker-compose logs -f app
```

### Restart Application

```bash
# PM2
pm2 restart blackmossandherbs

# Docker
sudo docker-compose restart app
```

### Update Application

```bash
cd /var/www/blackmossandherbs-platform
git pull origin main
npm install
npm run build

# PM2
pm2 restart blackmossandherbs

# Docker
sudo docker-compose up -d --build
```

## Backup Strategy

### Database Backup

```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
sudo -u postgres pg_dump blackmossandherbs > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-db.sh
```

### Code Backup

Your code is backed up in GitHub. Pull latest:
```bash
git pull origin main
```

## Firewall Configuration

```bash
# Install UFW
sudo apt install ufw

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

## Performance Optimization

### Enable Gzip in Nginx

Add to nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### PM2 Cluster Mode

```bash
# Use all CPU cores
pm2 start npm --name "blackmossandherbs" -i max -- start
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs blackmossandherbs
# or
sudo docker-compose logs app

# Check if port 3000 is in use
sudo lsof -i :3000

# Check environment variables
cat .env
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U dbuser -d blackmossandherbs -h localhost
```

### Nginx Issues

```bash
# Check nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## Cost Breakdown (Self-Hosted)

- **Server**: $5-20/month (DigitalOcean, Linode, Vultr)
- **Domain**: $10-15/year
- **SSL**: FREE (Let's Encrypt)
- **Database**: Included (self-hosted)
- **Total**: ~$5-20/month

Compare to Vercel Pro: $20/month + usage fees

## Server Providers (Budget-Friendly)

1. **DigitalOcean** - $6/month droplet
2. **Linode** - $5/month
3. **Vultr** - $5/month
4. **Hetzner** - €4.5/month (Europe)
5. **Contabo** - €5/month

All include enough resources for this platform.

## Next Steps

1. ✅ Choose deployment method (Docker or PM2)
2. ✅ Set up server and install dependencies
3. ✅ Configure environment variables
4. ✅ Set up database
5. ✅ Configure Nginx
6. ✅ Get SSL certificate
7. ✅ Deploy application
8. ✅ Set up monitoring and backups

---

**Your platform is now running on your own server with full control and minimal cost!** 🎉
