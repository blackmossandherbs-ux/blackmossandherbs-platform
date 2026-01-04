# 🚨 BLACK MOSS & HERBS - DEPLOYMENT EMERGENCY FIX

## 🔴 THE PROBLEM (Diagnosed and Confirmed)

Your website **blackmossandherbs.com** is **DOWN** because:

1. ❌ **Wrong site is showing** - Server is displaying "DJ Danny Hectic B" (Hectic Radio)
2. ❌ **Black Moss app not running** - Port 3005 is CLOSED
3. ✅ Server is online (213.199.45.126)
4. ✅ DNS is correct
5. ✅ Nginx is working
6. ⚠️ **Issue:** Multiple projects on server, wrong one is active

**Why this happened:** The server was set up with multiple websites and Nginx is configured to serve Hectic Radio instead of Black Moss & Herbs.

---

## ⚡ INSTANT FIX (1 Minute)

### Option 1: SSH + One Command

```bash
ssh root@213.199.45.126
cd /var/www/blackmossandherbs-platform
bash emergency-fix.sh
```

### Option 2: Copy/Paste This (If No Script)

SSH into server and paste these commands:

```bash
cd /var/www/blackmossandherbs-platform
docker ps | grep -v blackmoss | awk 'NR>1 {print $1}' | xargs -r docker stop
docker-compose down && docker-compose up -d
sleep 15
rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/*hectic*
cp config/blackmoss.nginx.conf /etc/nginx/sites-available/blackmossandherbs.com
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
curl http://localhost | grep -i title
```

---

## 📚 Detailed Documentation

I've created comprehensive guides for you:

### 1. **START HERE** → `DEPLOYMENT_STATUS.md`
   - Quick status overview
   - What's wrong and why
   - 30-second summary

### 2. **URGENT FIX** → `URGENT_FIX_GUIDE.md`
   - Step-by-step fix instructions
   - Multiple approaches (automated + manual)
   - Troubleshooting for common issues
   - **Best for beginners**

### 3. **DETAILED** → `DEPLOYMENT_FIX_README.md`
   - Deep dive into the problem
   - Understanding multi-site server setup
   - How to run multiple projects correctly
   - **Best for learning**

### 4. **SCRIPTS**
   - `emergency-fix.sh` - Ultra-fast 1-minute fix (run ON server)
   - `deploy-on-server.sh` - Complete deployment (run ON server)
   - `fix-deployment.sh` - Remote deployment (run FROM local machine)
   - `diagnose-server.sh` - Check status (run FROM local machine)

---

## 🎯 Quick Diagnosis

Run this from your computer:

```bash
./diagnose-server.sh
```

This will tell you:
- ✅ What's online
- ❌ What's wrong
- 🔧 What to do

---

## ⚠️ IMPORTANT: You NEED SSH Access

**Can't SSH?** You have these options:

1. **Use your hosting provider's web console**
   - DigitalOcean: "Console" button in droplet dashboard
   - Linode: "Launch Console" in Linode dashboard  
   - Vultr: "View Console" button

2. **Set up SSH keys**
   ```bash
   ssh-keygen -t ed25519
   ssh-copy-id root@213.199.45.126
   ```

3. **Contact your server provider** for access help

---

## ✅ How to Know It's Fixed

After running the fix:

```bash
# Should show Black Moss (NOT Hectic Radio)
curl http://blackmossandherbs.com | grep -i "title"

# Should show HTTP 200
curl -I http://blackmossandherbs.com
```

Or just visit http://blackmossandherbs.com in your browser!

---

## 📋 What Each File Does

```
├── DEPLOYMENT_STATUS.md           ← Start here (status summary)
├── URGENT_FIX_GUIDE.md            ← Best for fixing (detailed steps)
├── DEPLOYMENT_FIX_README.md       ← Understanding the issue
├── emergency-fix.sh               ← Fastest fix (1 min, run on server)
├── deploy-on-server.sh            ← Full deployment (run on server)
├── fix-deployment.sh              ← Remote fix (run locally with SSH)
├── diagnose-server.sh             ← Check status (run locally)
├── config/blackmoss.nginx.conf    ← Nginx configuration
└── docker-compose.yml             ← Docker setup
```

---

## 🚀 Quickest Path to Fix

1. **Can you SSH?**
   - YES → Run `emergency-fix.sh` on server (1 minute)
   - NO → See "IMPORTANT: You NEED SSH Access" above

2. **Is the app already deployed?**
   - YES → Just fix Nginx and restart
   - NO → Run full deployment: `deploy-on-server.sh`

3. **Multiple projects on server?**
   - See `DEPLOYMENT_FIX_README.md` section "Alternative: Run Both Sites"

---

## 💡 Why This Happened

Your server configuration looks like:

```
Server (213.199.45.126)
├── Nginx (Port 80) ───> Currently serving Hectic Radio ❌
├── Hectic Radio (Port 3000) ✅ Running
└── Black Moss (Port 3005) ❌ NOT running
```

**Fix:** Start Black Moss on port 3005, configure Nginx to proxy to it.

---

## 🔒 After It's Fixed

### 1. Set up SSL (HTTPS)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d blackmossandherbs.com -d www.blackmossandherbs.com
```

### 2. Set up monitoring

```bash
# View logs
docker-compose logs -f

# Check status
docker ps
systemctl status nginx
```

### 3. Prevent future issues

- Document which ports each project uses
- Use unique container names
- Keep separate Nginx configs for each domain

---

## 📞 Still Stuck?

1. Run diagnostics: `./diagnose-server.sh`
2. Read: `URGENT_FIX_GUIDE.md`
3. Check logs on server:
   ```bash
   docker-compose logs blackmoss-app-service
   tail -f /var/log/nginx/error.log
   ```

---

## 🎯 TL;DR

**Problem:** Server showing wrong website (Hectic Radio instead of Black Moss)  
**Cause:** Multiple projects on server, wrong one configured in Nginx  
**Fix:** SSH into server, run `emergency-fix.sh`  
**Time:** 1-5 minutes  
**Requirement:** SSH access to server

---

**Ready?** SSH into your server and run the emergency fix! 🚀
