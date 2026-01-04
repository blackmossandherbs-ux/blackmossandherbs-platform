# 🔧 Deployment Fix Guide

## Problem Summary
The website is down due to:
1. **Port conflicts** - Docker uses port 3005, PM2 uses port 3000, nginx configs pointing to wrong ports
2. **Multiple site confusion** - Server has multiple projects causing nginx conflicts
3. **App not running** - Application may have stopped or crashed

## Quick Fix (Run on Server)

### Option 1: Automated Fix (Recommended)

SSH into your server and run:

```bash
ssh root@213.199.45.126

# Download and run the fix script
cd /var/www/blackmossandherbs-platform
git pull origin main
chmod +x fix-deployment.sh
./fix-deployment.sh
```

This script will:
- ✅ Detect if Docker or PM2 is running
- ✅ Stop conflicting services
- ✅ Update the repository
- ✅ Deploy the application correctly
- ✅ Configure nginx properly
- ✅ Verify everything is working

### Option 2: Manual Fix Steps

If you prefer manual steps:

#### 1. SSH into Server
```bash
ssh root@213.199.45.126
cd /var/www/blackmossandherbs-platform
```

#### 2. Check What's Running
```bash
# Check PM2
pm2 status

# Check Docker
docker ps

# Check nginx
systemctl status nginx
```

#### 3. Stop Conflicting Services
```bash
# If using PM2, stop Docker
docker-compose down

# If using Docker, stop PM2
pm2 delete blackmossandherbs
```

#### 4. Update Code
```bash
git pull origin main
npm install
```

#### 5. Deploy with PM2 (Recommended)
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Build
npm run build

# Start with PM2
pm2 delete blackmossandherbs 2>/dev/null || true
pm2 start npm --name "blackmossandherbs" -- start
pm2 save
pm2 startup
```

#### 6. Fix Nginx Configuration
```bash
# Create proper nginx config
cat > /etc/nginx/sites-available/blackmossandherbs << 'EOF'
server {
    listen 80;
    server_name blackmossandherbs.com www.blackmossandherbs.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
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

# Redirect other domains
server {
    listen 80;
    server_name blackmossandherbs.co.uk www.blackmossandherbs.co.uk;
    return 301 http://blackmossandherbs.com$request_uri;
}

server {
    listen 80;
    server_name blackmossandherbs.info www.blackmossandherbs.info;
    return 301 http://blackmossandherbs.com$request_uri;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/blackmossandherbs /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart
nginx -t
systemctl restart nginx
```

#### 7. Verify Everything Works
```bash
# Check app is running
curl http://localhost:3000

# Check PM2 status
pm2 status

# Check nginx status
systemctl status nginx

# Check nginx logs
tail -f /var/log/nginx/error.log
```

## Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use PM2
pm2 delete blackmossandherbs
```

### Issue: Nginx Config Error
```bash
# Test config
nginx -t

# Check error logs
tail -f /var/log/nginx/error.log

# Restart nginx
systemctl restart nginx
```

### Issue: App Not Starting
```bash
# Check PM2 logs
pm2 logs blackmossandherbs

# Check environment variables
cat .env

# Check database connection
psql -U dbuser -d blackmossandherbs -h localhost
```

### Issue: Multiple Sites Conflicting
```bash
# List all nginx sites
ls -la /etc/nginx/sites-enabled/

# Disable conflicting sites
rm /etc/nginx/sites-enabled/other-site

# Reload nginx
nginx -t && systemctl reload nginx
```

## After Fix - Verify Site is Live

1. **Check locally on server:**
   ```bash
   curl http://localhost:3000
   ```

2. **Check from browser:**
   - http://blackmossandherbs.com
   - http://213.199.45.126

3. **Check DNS:**
   ```bash
   dig blackmossandherbs.com
   # Should point to 213.199.45.126
   ```

## Setup SSL (After Site is Working)

Once HTTP is working, add SSL:

```bash
# Install certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d blackmossandherbs.com -d www.blackmossandherbs.com

# Auto-renewal is automatic
```

## Monitoring

### Check Application Status
```bash
pm2 status
pm2 logs blackmossandherbs --lines 50
```

### Check Nginx Status
```bash
systemctl status nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Check System Resources
```bash
htop
df -h
free -h
```

## Need Help?

If the automated fix script doesn't work:

1. Check the logs: `pm2 logs blackmossandherbs`
2. Check nginx: `systemctl status nginx`
3. Verify .env file has correct credentials
4. Ensure database is running: `systemctl status postgresql`
5. Check firewall: `ufw status`

---

**Quick Command Summary:**
```bash
# Full automated fix
cd /var/www/blackmossandherbs-platform && git pull && ./fix-deployment.sh

# Manual restart
pm2 restart blackmossandherbs && systemctl restart nginx

# Check status
pm2 status && systemctl status nginx
```
