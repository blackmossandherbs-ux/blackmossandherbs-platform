# Server Deployment Guide for 213.199.45.126

## Quick Deploy

```bash
./deploy-to-server.sh
```

This will:
1. Connect to your server
2. Install all dependencies (Node.js, PostgreSQL, Nginx, etc.)
3. Clone the repository
4. Configure environment
5. Deploy the application

## Manual Steps

If you prefer manual deployment:

### 1. SSH into Server

```bash
ssh root@213.199.45.126
```

### 2. Run Server Setup

```bash
wget https://raw.githubusercontent.com/richhabits/blackmossandherbs-platform/main/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

### 3. Clone Repository

```bash
cd /var/www
git clone https://github.com/richhabits/blackmossandherbs-platform.git
cd blackmossandherbs-platform
```

### 4. Configure Environment

```bash
cp .env.example .env
nano .env
```

Add your credentials:
- Database connection
- NextAuth secret (generate with: `openssl rand -base64 32`)
- Stripe API keys

### 5. Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

Choose Docker or PM2 when prompted.

### 6. Setup SSL

```bash
chmod +x setup-ssl.sh
./setup-ssl.sh
```

### 7. Configure Nginx

```bash
cp nginx.conf /etc/nginx/nginx.conf
nano /etc/nginx/nginx.conf  # Update domain
nginx -t
systemctl restart nginx
```

## Access Your Site

After deployment:
- **Direct**: http://213.199.45.126:3000
- **With Nginx**: http://yourdomain.com (after DNS setup)
- **With SSL**: https://yourdomain.com (after SSL setup)

## Troubleshooting

### Check Application Status

**PM2:**
```bash
pm2 status
pm2 logs blackmossandherbs
```

**Docker:**
```bash
docker-compose ps
docker-compose logs -f
```

### Restart Application

**PM2:**
```bash
pm2 restart blackmossandherbs
```

**Docker:**
```bash
docker-compose restart
```

## Server Info

- **IP**: 213.199.45.126
- **App Directory**: /var/www/blackmossandherbs-platform
- **Port**: 3000 (application)
- **Database**: PostgreSQL on localhost:5432

## Support

See DEPLOYMENT.md for detailed instructions.
