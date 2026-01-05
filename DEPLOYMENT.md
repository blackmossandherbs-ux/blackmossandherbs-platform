# Self-Hosted Server Deployment Guide

## 🏠 Deploy to Your Own Server

This guide shows you how to deploy Black Moss & Herbs to your own server (VPS, dedicated server, etc.) without any expensive third-party services.

## Prerequisites

- Linux server (Ubuntu 20.04+ recommended)
- Root or sudo access
- Domain name pointed to your server
- At least 2GB RAM, 20GB storage

## Quick Start (Automated)

The repository includes scripts to automate nearly the entire process.

1.  **SSH into your server:**
    ```bash
    ssh root@your-server-ip
    ```

2.  **Download and run the setup script:**
    ```bash
    wget https://raw.githubusercontent.com/richhabits/blackmossandherbs-platform/main/setup-server.sh
    chmod +x setup-server.sh
    ./setup-server.sh
    ```
    *This will install Node.js, PostgreSQL, Nginx, Docker, and PM2.*

3.  **Clone the repository:**
    ```bash
    cd /var/www
    git clone https://github.com/richhabits/blackmossandherbs-platform.git
    cd blackmossandherbs-platform
    ```

4.  **Configure Environment:**
    ```bash
    cp .env.example .env
    nano .env
    ```
    *Fill in your database credentials, Stripe keys, and NextAuth secret.*

5.  **Deploy:**
    ```bash
    ./deploy.sh
    ```
    *Follow the prompts to choose Docker or PM2. This script also configures Nginx.*

6.  **Setup SSL:**
    ```bash
    ./setup-ssl.sh
    ```
    *This secures your site with free Let's Encrypt certificates.*

---

## Detailed Manual Deployment

If you prefer manual control or need to debug, follow these steps.

### Option 1: Docker Deployment (Recommended)

1.  **Start Containers:**
    ```bash
    docker-compose up -d --build
    ```

2.  **Run Migrations:**
    ```bash
    docker-compose exec app npx prisma generate
    docker-compose exec app npx prisma db push
    ```

The application runs on port **3005** by default in this configuration.

### Option 2: PM2 Deployment

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Build:**
    ```bash
    npx prisma generate
    npx prisma db push
    npm run build
    ```

3.  **Start:**
    ```bash
    PORT=3005 pm2 start npm --name "blackmossandherbs" -- start
    pm2 save
    pm2 startup
    ```

## Nginx Configuration

We use Nginx as a reverse proxy to handle traffic and SSL.

1.  **App Configuration:**
    Located at `config/blackmoss.nginx.conf`. It proxies traffic to port 3005.

2.  **Catch-All Configuration:**
    Located at `config/catchall.nginx.conf`. It ensures that traffic to unknown domains pointing to your IP is dropped, preventing "site confusion".

To apply these manually:
```bash
cp config/blackmoss.nginx.conf /etc/nginx/sites-available/blackmossandherbs
ln -s /etc/nginx/sites-available/blackmossandherbs /etc/nginx/sites-enabled/

cp config/catchall.nginx.conf /etc/nginx/sites-available/catchall
ln -s /etc/nginx/sites-available/catchall /etc/nginx/sites-enabled/000-catchall

systemctl reload nginx
```

## Maintenance

### Common Commands

*   **View Logs:**
    *   Docker: `docker-compose logs -f`
    *   PM2: `pm2 logs blackmossandherbs`
*   **Restart:**
    *   Docker: `docker-compose restart`
    *   PM2: `pm2 restart blackmossandherbs`
*   **Update Code:**
    ```bash
    git pull origin main
    ./deploy.sh
    ```

### Backup

**Database Backup Script:**
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
sudo -u postgres pg_dump blackmossandherbs > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

Add this to your crontab for daily backups.
