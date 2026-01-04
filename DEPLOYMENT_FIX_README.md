# 🚨 BLACK MOSS & HERBS - DEPLOYMENT FIX

## Problem Identified ✅

Your server at **213.199.45.126** is **online and working**, but it's serving the **WRONG website**!

- ❌ Currently serving: **"DJ Danny Hectic B" (Hectic Radio)**
- ✅ Should be serving: **Black Moss & Herbs**

### What Happened?

The server has **multiple projects** deployed and Nginx is configured to serve **Hectic Radio** instead of Black Moss & Herbs. This is why you see the wrong website when you visit blackmossandherbs.com.

### Diagnosis Results

```
✅ Server is online (213.199.45.126)
✅ Nginx is running
✅ DNS is correct (blackmossandherbs.com → 213.199.45.126)
✅ Port 80 is responding with HTTP 200
❌ Wrong application is being served
```

---

## 🔧 SOLUTION: Fix the Deployment

You need to SSH into the server and run the correct deployment. Here are **3 ways** to fix this:

---

## Option 1: Automated Fix (Requires SSH Access)

```bash
./fix-deployment.sh
```

This script will:
1. Stop conflicting projects
2. Deploy Black Moss & Herbs properly
3. Configure Nginx correctly
4. Restart services

**Note:** You need SSH key access set up for this to work automatically.

---

## Option 2: Manual Fix (Copy & Paste Commands)

SSH into your server first:

```bash
ssh root@213.199.45.126
```

Then run these commands:

```bash
# 1. Stop the conflicting site (Hectic Radio)
echo "Stopping conflicting services..."
docker ps | grep -v blackmoss | awk 'NR>1 {print $1}' | xargs -r docker stop
pm2 list

# 2. Navigate to Black Moss & Herbs directory
cd /var/www/blackmossandherbs-platform

# If directory doesn't exist, clone it:
# cd /var/www
# git clone https://github.com/YOUR_USERNAME/blackmossandherbs-platform.git
# cd blackmossandherbs-platform

# 3. Pull latest code
git pull origin main

# 4. Install dependencies
npm install --production

# 5. Build the application
npm run build

# 6. Setup environment (if not done already)
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Edit .env file with your credentials!"
    nano .env
fi

# 7. Run database migrations
npx prisma generate
npx prisma db push

# 8. Start with Docker
docker-compose down
docker-compose up -d

# Wait for it to start
sleep 10

# 9. Fix Nginx configuration
# Backup old configs
mkdir -p /etc/nginx/sites-backup
cp /etc/nginx/sites-enabled/* /etc/nginx/sites-backup/

# Remove conflicting configs
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/hectic*

# Install Black Moss & Herbs config
cp /var/www/blackmossandherbs-platform/config/blackmoss.nginx.conf /etc/nginx/sites-available/blackmossandherbs.com
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/blackmossandherbs.com

# 10. Test and restart Nginx
nginx -t
systemctl restart nginx

# 11. Verify it's working
echo "Testing local app..."
curl -I http://localhost:3005

echo "Testing Nginx..."
curl -I http://localhost

echo "✅ Done! Visit http://blackmossandherbs.com"
```

---

## Option 3: Quick Docker-Only Fix

If Black Moss & Herbs is already deployed but just not active:

```bash
ssh root@213.199.45.126

# Stop other projects
cd /var/www
docker ps -a  # See what's running

# Stop Hectic Radio or other projects
docker stop $(docker ps -q)

# Start Black Moss & Herbs
cd /var/www/blackmossandherbs-platform
docker-compose up -d

# Fix Nginx
rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/hectic*
cp config/blackmoss.nginx.conf /etc/nginx/sites-available/blackmossandherbs.com
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
```

---

## 🎯 Understanding the Issue

Your server configuration looks like this:

```
┌─────────────────────────────────────┐
│  Server: 213.199.45.126             │
├─────────────────────────────────────┤
│  Nginx (Port 80)                    │
│    ↓                                │
│  Currently → Hectic Radio ❌        │
│  Should be → Black Moss & Herbs ✅  │
├─────────────────────────────────────┤
│  Running Applications:              │
│  - Hectic Radio (active)            │
│  - Black Moss & Herbs (inactive?)   │
└─────────────────────────────────────┘
```

**The Fix:** Tell Nginx to proxy to Black Moss & Herbs (port 3005) instead of Hectic Radio.

---

## 📋 Post-Fix Checklist

After running the fix, verify:

```bash
# 1. Check Docker containers
docker ps

# Should see: blackmoss-app (running)

# 2. Check application is responding
curl -I http://localhost:3005
# Should see: HTTP 200 with Next.js headers

# 3. Check Nginx config
nginx -t
# Should see: test is successful

# 4. Check what Nginx is serving
curl -I http://localhost
# Should see: HTTP 200

# 5. Check the actual content
curl http://localhost | grep -i "title"
# Should see: Black Moss or similar (NOT Hectic Radio)

# 6. Test from outside
curl http://blackmossandherbs.com | grep -i "title"
# Should see: Black Moss content
```

---

## 🔒 Important Notes

### Environment Variables

Make sure `/var/www/blackmossandherbs-platform/.env` has:

```env
DATABASE_URL="postgresql://user:password@blackmoss-db-service:5432/blackmossandherbs"
NEXTAUTH_URL="https://blackmossandherbs.com"
NEXTAUTH_SECRET="your-secret-here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_APP_URL="https://blackmossandherbs.com"
```

### SSL Certificate

After the basic fix works (HTTP), set up SSL:

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d blackmossandherbs.com -d www.blackmossandherbs.com

# Test renewal
certbot renew --dry-run
```

### Multiple Projects on One Server

If you want to run multiple projects:

1. Each project should use **different ports**:
   - Black Moss & Herbs: port 3005 ✅
   - Hectic Radio: port 3006 (or different)

2. Each project needs its **own Nginx config**:
   - `/etc/nginx/sites-available/blackmossandherbs.com`
   - `/etc/nginx/sites-available/hecticradio.com`

3. Each config should proxy to the correct port:
   ```nginx
   server {
       server_name blackmossandherbs.com;
       location / {
           proxy_pass http://127.0.0.1:3005;  # Black Moss
       }
   }
   
   server {
       server_name hecticradio.com;
       location / {
           proxy_pass http://127.0.0.1:3006;  # Hectic Radio
       }
   }
   ```

---

## ❓ Troubleshooting

### "Port 3005 not responding"

```bash
# Check if app is running
docker ps
docker-compose logs -f

# Restart if needed
docker-compose restart
```

### "Nginx test fails"

```bash
# Check syntax errors
nginx -t

# View error details
cat /var/log/nginx/error.log | tail -20

# Restore backup if needed
cp /etc/nginx/sites-backup/* /etc/nginx/sites-enabled/
```

### "Still seeing Hectic Radio"

```bash
# Clear browser cache or use:
curl -I http://blackmossandherbs.com

# Check Nginx config
cat /etc/nginx/sites-enabled/blackmossandherbs.com

# Make sure it proxies to port 3005
```

### "Database connection error"

```bash
# Check if database container is running
docker ps | grep postgres

# Check database logs
docker-compose logs blackmoss-db-service

# Restart database
docker-compose restart blackmoss-db-service
```

---

## 📞 Need Help?

If you're still having issues, gather this info:

```bash
# On the server, run:
echo "=== Docker Status ==="
docker ps -a

echo "=== Nginx Config ==="
ls -la /etc/nginx/sites-enabled/

echo "=== Application Logs ==="
docker-compose logs --tail=50 blackmoss-app-service

echo "=== Nginx Logs ==="
tail -50 /var/log/nginx/error.log

echo "=== What's Running on Port 80 ==="
curl -I http://localhost
```

Share this output for further assistance.

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ `curl http://blackmossandherbs.com` shows Black Moss content
2. ✅ `docker ps` shows `blackmoss-app` running
3. ✅ Browser shows Black Moss & Herbs website (not Hectic Radio)
4. ✅ No "Hectic Radio" or "DJ Danny" text appears

---

**Bottom Line:** Your server is fine, Nginx is just pointing to the wrong app. Follow the steps above to fix it! 🚀
