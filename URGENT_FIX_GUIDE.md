# 🚨 URGENT: Black Moss & Herbs Deployment Issue - SOLVED

## Current Status (Confirmed)

✅ Server Online: `213.199.45.126`  
✅ DNS Correct: `blackmossandherbs.com` → `213.199.45.126`  
✅ Nginx Running: Port 80 responding  
❌ **WRONG SITE SHOWING**: Currently serving "DJ Danny Hectic B" (Hectic Radio)  
❌ Black Moss & Herbs: **NOT RUNNING** (Port 3005 closed)

---

## What's Wrong?

Your server has **multiple projects**, and it's serving **Hectic Radio** instead of **Black Moss & Herbs**. The Black Moss application isn't even running (port 3005 is closed).

```
Current Setup:
┌──────────────────────────────────────┐
│ Server: 213.199.45.126               │
├──────────────────────────────────────┤
│ Nginx :80 → ❌ Hectic Radio          │
│                                      │
│ Port 3000: OPEN (Some app)           │
│ Port 3005: CLOSED ❌ (Black Moss)    │
└──────────────────────────────────────┘
```

**You need to start Black Moss & Herbs and configure Nginx to serve it.**

---

## 🎯 Quick Fix (3 Steps)

### Step 1: SSH into Server

```bash
ssh root@213.199.45.126
```

If you can't SSH, you need to set up SSH access first (ask your server provider for help or use their web console).

### Step 2: Start Black Moss & Herbs

Once logged into the server:

```bash
# Go to the Black Moss directory
cd /var/www/blackmossandherbs-platform

# If it doesn't exist, clone it first:
# cd /var/www
# git clone https://YOUR_GITHUB_URL/blackmossandherbs-platform.git
# cd blackmossandherbs-platform

# Pull latest code
git pull

# Make sure .env file exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  IMPORTANT: Edit .env with your credentials!"
  nano .env
fi

# Install and build
npm install --production
npm run build

# Setup database
npx prisma generate
npx prisma db push

# Start with Docker
docker-compose up -d

# OR start with PM2 (alternative)
# pm2 start ecosystem.config.js
# pm2 save

# Wait a few seconds for startup
sleep 10

# Verify it's running
curl -I http://localhost:3005
```

### Step 3: Fix Nginx

Still on the server:

```bash
# Stop other projects if needed
docker ps  # See what's running
# Stop hectic radio if it's using port 80
docker stop $(docker ps -q --filter "name=hectic")

# Configure Nginx for Black Moss
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/hectic*

# Copy Black Moss config
cp /var/www/blackmossandherbs-platform/config/blackmoss.nginx.conf \
   /etc/nginx/sites-available/blackmossandherbs.com

# Enable it
ln -sf /etc/nginx/sites-available/blackmossandherbs.com \
       /etc/nginx/sites-enabled/blackmossandherbs.com

# Test and restart Nginx
nginx -t
systemctl restart nginx

# Verify
curl -I http://localhost
curl http://localhost | grep -i "title"
```

If you see "Black Moss" in the title, **you're done!** 🎉

---

## 📋 Verification Checklist

After running the fix, check these:

```bash
# On the server:

# 1. Is the app running?
docker ps | grep blackmoss
# Should show: blackmoss-app (Up X minutes)

# 2. Is port 3005 responding?
curl -I http://localhost:3005
# Should show: HTTP 200

# 3. What is Nginx serving?
curl http://localhost | head -50 | grep -i "title"
# Should NOT say "Hectic Radio"
# Should say "Black Moss" or your site name

# 4. Check from outside
curl http://blackmossandherbs.com | grep -i "title"
# Should show your Black Moss site

# 5. Check in browser
# Visit: http://blackmossandherbs.com
# You should see Black Moss & Herbs, not Hectic Radio
```

---

## 🔧 Alternative: Run Both Sites

If you want to keep both sites running:

### For Black Moss (Port 3005)

```nginx
# /etc/nginx/sites-available/blackmossandherbs.com
server {
    server_name blackmossandherbs.com www.blackmossandherbs.com;
    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_set_header Host $host;
    }
    listen 80;
}
```

### For Hectic Radio (Port 3000 or 3006)

```nginx
# /etc/nginx/sites-available/hecticradio.com
server {
    server_name hecticradio.com www.hecticradio.com;
    location / {
        proxy_pass http://127.0.0.1:3000;  # or whatever port
        proxy_set_header Host $host;
    }
    listen 80;
}
```

Enable both:

```bash
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/hecticradio.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🆘 Troubleshooting

### "Can't SSH into server"

**Problem:** No SSH access configured.

**Solutions:**
1. Use your hosting provider's web console (DigitalOcean, Linode, etc.)
2. Set up SSH keys:
   ```bash
   ssh-keygen -t ed25519
   ssh-copy-id root@213.199.45.126
   ```
3. Ask your server provider to add your SSH key

### "Port 3005 still not responding"

**Check Docker:**
```bash
docker ps -a | grep blackmoss
docker-compose logs blackmoss-app-service
```

**If not running:**
```bash
cd /var/www/blackmossandherbs-platform
docker-compose up -d
docker-compose logs -f
```

**Common issues:**
- Missing `.env` file
- Database not running
- Build errors
- Port already in use

### "Nginx test fails"

**Check syntax:**
```bash
nginx -t
cat /var/log/nginx/error.log | tail -20
```

**Common issues:**
- Typo in config file
- Missing semicolon
- Wrong file path
- Port conflict

### "Still seeing Hectic Radio"

**Clear browser cache:**
- Chrome: Ctrl+Shift+R
- Firefox: Ctrl+F5
- Or use incognito mode

**Verify server side:**
```bash
# What's Nginx serving?
curl -I http://localhost

# What config is active?
cat /etc/nginx/sites-enabled/* | grep server_name

# Remove ALL other configs
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
```

### "Database errors"

**Check database:**
```bash
docker ps | grep postgres
docker-compose logs blackmoss-db-service
```

**Fix database:**
```bash
cd /var/www/blackmossandherbs-platform
docker-compose restart blackmoss-db-service
npx prisma generate
npx prisma db push
docker-compose restart blackmoss-app-service
```

---

## 📞 Still Need Help?

Run the diagnostic script from your local machine:

```bash
./diagnose-server.sh
```

Then share the output. Also gather this info from the server:

```bash
# On server:
echo "=== Docker ==="
docker ps -a

echo "=== Nginx Config ==="
ls -la /etc/nginx/sites-enabled/
cat /etc/nginx/sites-enabled/*

echo "=== What's Running ==="
curl -I http://localhost:3005
curl -I http://localhost

echo "=== Ports ==="
netstat -tlnp | grep :3005
netstat -tlnp | grep :80

echo "=== Black Moss Logs ==="
cd /var/www/blackmossandherbs-platform
docker-compose logs --tail=100 blackmoss-app-service
```

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ `docker ps` shows `blackmoss-app` running
2. ✅ `curl http://localhost:3005` returns HTTP 200
3. ✅ `curl http://localhost` shows Black Moss content (not Hectic)
4. ✅ Browser shows Black Moss & Herbs at http://blackmossandherbs.com
5. ✅ No mention of "Hectic Radio" or "DJ Danny"

---

## 🔐 After It Works

### Set up SSL (HTTPS):

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d blackmossandherbs.com -d www.blackmossandherbs.com
certbot renew --dry-run
```

### Set up auto-restart:

```bash
# Docker already restarts automatically with "restart: always"
docker ps -a | grep blackmoss

# For PM2:
pm2 startup
pm2 save
```

### Set up monitoring:

```bash
# Check logs anytime:
docker-compose logs -f

# Monitor resources:
docker stats

# PM2 monitoring:
pm2 monit
```

---

## 💡 Key Takeaway

**The issue:** Nginx is configured to proxy to Hectic Radio instead of Black Moss & Herbs, AND Black Moss isn't even running (port 3005 is closed).

**The fix:** Start Black Moss & Herbs on port 3005, then configure Nginx to proxy blackmossandherbs.com to port 3005.

**Files involved:**
- Docker: `/var/www/blackmossandherbs-platform/docker-compose.yml`
- Nginx: `/etc/nginx/sites-available/blackmossandherbs.com`
- App: Running on port 3005

---

## 🚀 One-Command Fix (If You Have SSH Access)

From your local machine, if SSH is set up:

```bash
./fix-deployment.sh
```

This will automatically:
1. Stop conflicting services
2. Start Black Moss & Herbs
3. Configure Nginx
4. Restart everything

---

**Need SSH access?** Contact your server provider or use their web console to run these commands manually.

**Good luck!** 🍀
