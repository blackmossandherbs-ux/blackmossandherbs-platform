# Server Deployment Guide for 213.199.45.126

## ⚠️ IMPORTANT: Multi-Site Server Configuration

This server hosts **multiple websites**. Each site runs on its own port:

| Site | Port | Status |
|------|------|--------|
| DJ Danny Hectic B | 3000 | Running |
| **Black Moss & Herbs** | **3005** | This site |

**DO NOT use port 3000** - it will conflict with other sites!

---

## Quick Deploy (Recommended)

```bash
./quick-deploy.sh
```

This will:
1. Connect to your server
2. Pull latest code
3. Build and restart the app on **port 3005**
4. Configure nginx for blackmossandherbs.com

---

## Full Setup (First Time)

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

### Check What's Running on Each Port

```bash
# See all sites/ports
ss -tlnp | grep -E '(:3000|:3005|:80|:443)'

# Check which site is on which port
curl -s http://127.0.0.1:3000 | grep '<title>'  # DJ Danny Hectic B
curl -s http://127.0.0.1:3005 | grep '<title>'  # Black Moss & Herbs
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

### Fix Wrong Site Showing

If blackmossandherbs.com shows the wrong site, the nginx config is pointing to the wrong port:

```bash
# Check nginx config
cat /etc/nginx/sites-available/blackmoss.conf | grep proxy_pass

# Should show: proxy_pass http://127.0.0.1:3005;
# If it shows port 3000, update it!

# Re-apply correct config
cd /var/www/blackmossandherbs-platform
cp config/blackmoss.nginx.conf /etc/nginx/sites-available/blackmoss.conf
ln -sf /etc/nginx/sites-available/blackmoss.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Setup SSL (HTTPS)

```bash
certbot --nginx -d blackmossandherbs.com -d www.blackmossandherbs.com
```

## Server Info

- **IP**: 213.199.45.126
- **App Directory**: /var/www/blackmossandherbs-platform
- **Port**: 3005 (Black Moss & Herbs - DO NOT USE 3000!)
- **Database**: PostgreSQL on localhost:5432 (or 5435 for Docker)
- **Other Sites**: Port 3000 = DJ Danny Hectic B

## Nginx Configuration

The nginx config for this site is at:
- Source: `config/blackmoss.nginx.conf`
- Server: `/etc/nginx/sites-available/blackmoss.conf`

Make sure it points to port 3005, not 3000!

## Support

See DEPLOYMENT.md for detailed instructions.
