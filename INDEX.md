# 🚨 BLACK MOSS & HERBS - DEPLOYMENT FIX INDEX

**Last Updated:** January 4, 2026  
**Status:** ISSUE IDENTIFIED ✅ | FIX READY ✅ | AWAITING DEPLOYMENT ⏳

---

## 🎯 START HERE

### Your website is down because the wrong site is being served!

- **Your domain:** blackmossandherbs.com
- **Currently showing:** DJ Danny Hectic B (Hectic Radio) ❌
- **Should show:** Black Moss & Herbs ✅
- **Root cause:** Multiple projects on server, Nginx configured for wrong one

**Quick Fix:** SSH into server and run `emergency-fix.sh` (1 minute)

---

## 📚 Documentation Guide

I've created **8 documents** to help you fix this. Here's what to read based on your situation:

### 🚀 Just Want to Fix It FAST?

1. **Read:** `DEPLOYMENT_STATUS.md` (30 seconds - understand the problem)
2. **Read:** `URGENT_FIX_GUIDE.md` (2 minutes - step-by-step fix)
3. **Run:** `emergency-fix.sh` on your server (1 minute)
4. **Done!** ✅

### 🧐 Want to Understand What's Wrong?

1. **Read:** `VISUAL_DIAGNOSIS.md` (diagrams showing the problem)
2. **Read:** `DEPLOYMENT_FIX_README.md` (detailed explanation)
3. **Run:** `diagnose-server.sh` from your computer
4. **Then fix:** Follow URGENT_FIX_GUIDE.md

### 🛠️ Need to Deploy from Scratch?

1. **Read:** `DEPLOYMENT.md` (full deployment guide)
2. **Run:** `deploy-on-server.sh` on the server
3. **Or run:** `deploy-to-server.sh` from your local machine

---

## 📋 Complete File Reference

### Status & Diagnosis

| File | Purpose | When to Use |
|------|---------|-------------|
| `DEPLOYMENT_STATUS.md` | Current status summary | Start here - quick overview |
| `VISUAL_DIAGNOSIS.md` | Visual diagrams of the problem | Understanding the issue |
| `diagnose-server.sh` | Automated diagnostics | Check current state from your computer |

### Fix Guides

| File | Purpose | When to Use |
|------|---------|-------------|
| `URGENT_FIX_GUIDE.md` | Step-by-step manual fix | Best for beginners, comprehensive |
| `DEPLOYMENT_FIX_README.md` | Detailed technical explanation | Deep understanding, multi-site setup |
| `README_DEPLOYMENT_FIX.md` | Master deployment fix guide | All-in-one reference |

### Automation Scripts

| File | Purpose | Run From | Time |
|------|---------|----------|------|
| `emergency-fix.sh` | Ultra-fast fix | ON server | 1 min |
| `deploy-on-server.sh` | Complete deployment | ON server | 5-10 min |
| `fix-deployment.sh` | Remote deployment | Your computer (needs SSH) | 5 min |
| `deploy-to-server.sh` | Interactive remote deploy | Your computer (needs SSH) | 5-10 min |

### Configuration Files

| File | Purpose |
|------|---------|
| `config/blackmoss.nginx.conf` | Nginx reverse proxy config |
| `docker-compose.yml` | Docker container definitions |
| `.env.example` | Environment variables template |
| `ecosystem.config.js` | PM2 configuration (alternative to Docker) |

### Reference Documentation

| File | Purpose |
|------|---------|
| `DEPLOYMENT.md` | Original full deployment guide |
| `SERVER_213.199.45.126.md` | Server-specific instructions |
| `SERVER_READY.md` | Platform features overview |
| `QUICKSTART.md` | Quick deployment reference |

---

## 🎯 Decision Tree: Which Guide Should I Use?

```
START
  │
  ├─ Do you have SSH access to the server?
  │   │
  │   ├─ YES ─── Is Black Moss already deployed?
  │   │    │
  │   │    ├─ YES ─── Use: emergency-fix.sh
  │   │    │          Time: 1 minute
  │   │    │          Fixes: Nginx config + restarts services
  │   │    │
  │   │    └─ NO ──── Use: deploy-on-server.sh
  │   │               Time: 5-10 minutes
  │   │               Does: Full deployment + setup
  │   │
  │   └─ NO ──── Read: URGENT_FIX_GUIDE.md
  │              Get SSH access first, then continue
  │
  └─ Want to understand the problem first?
       │
       └─── Read: VISUAL_DIAGNOSIS.md
            Then: DEPLOYMENT_STATUS.md
            Then: URGENT_FIX_GUIDE.md
```

---

## ⚡ Quick Command Reference

### From Your Computer (Diagnostics)

```bash
# Check what's wrong
./diagnose-server.sh

# See what the site is showing
curl http://blackmossandherbs.com | grep -i "title"

# Check if port 3005 is open
curl -I http://213.199.45.126:3005
```

### On the Server (Fixes)

```bash
# FASTEST FIX (1 minute)
cd /var/www/blackmossandherbs-platform
bash emergency-fix.sh

# OR Manual commands
docker-compose up -d
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Verify it worked
curl http://localhost | grep -i title
```

---

## 🔍 Current Server State (Last Checked)

```
Server IP:           213.199.45.126
Domain:              blackmossandherbs.com
DNS Status:          ✅ Correct (points to server)
Server Online:       ✅ Yes
Port 22 (SSH):       ✅ Open
Port 80 (HTTP):      ✅ Open
Port 443 (HTTPS):    ❌ Closed (SSL not set up)
Port 3000:           ✅ Open (Hectic Radio)
Port 3005:           ❌ Closed (Black Moss NOT running)

Nginx Status:        ✅ Running
Nginx Serving:       ❌ Wrong site (Hectic Radio)

Black Moss Status:   ❌ NOT RUNNING
Hectic Radio Status: ✅ Running

PROBLEM:             Nginx proxying to wrong app
FIX REQUIRED:        Start Black Moss + Configure Nginx
```

---

## 📊 Fix Success Checklist

After running the fix, verify these:

```bash
# ON THE SERVER:

# ✅ 1. Docker containers running
docker ps | grep blackmoss
# Should show: blackmoss-app and blackmoss-db

# ✅ 2. Port 3005 responding
curl -I http://localhost:3005
# Should return: HTTP/1.1 200 OK

# ✅ 3. Nginx configured correctly
cat /etc/nginx/sites-enabled/blackmossandherbs.com | grep proxy_pass
# Should show: proxy_pass http://127.0.0.1:3005;

# ✅ 4. Nginx serving correct content
curl http://localhost | grep -i "title"
# Should show: Black Moss (NOT Hectic Radio)

# FROM YOUR COMPUTER:

# ✅ 5. Domain working
curl http://blackmossandherbs.com | grep -i "title"
# Should show: Black Moss content

# ✅ 6. Browser test
# Visit: http://blackmossandherbs.com
# Should see: Black Moss & Herbs website
```

---

## 🆘 Troubleshooting Guide

### "I can't SSH into the server"

**Solutions:**
1. Use your hosting provider's web console (DigitalOcean, Linode, etc.)
2. Set up SSH keys: `ssh-copy-id root@213.199.45.126`
3. Contact your server provider for access

**Where to read:** URGENT_FIX_GUIDE.md - Section "Option 2: Manual Fix"

---

### "Port 3005 won't open"

**Possible causes:**
- App not started
- Docker not running
- Build errors
- Port conflict

**Where to read:** DEPLOYMENT_FIX_README.md - Section "Troubleshooting"

**Commands to run:**
```bash
docker ps -a
docker-compose logs blackmoss-app-service
netstat -tlnp | grep 3005
```

---

### "Still seeing Hectic Radio"

**Possible causes:**
- Browser cache
- Wrong Nginx config
- Multiple configs active

**Where to read:** VISUAL_DIAGNOSIS.md - Section "Common Mistakes"

**Quick fix:**
```bash
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
```

---

### "Docker won't start"

**Where to read:** DEPLOYMENT.md - Section "Option 2: PM2 Deployment"

**Alternative:** Use PM2 instead of Docker
```bash
npm install
npm run build
pm2 start ecosystem.config.js
```

---

## 🔐 After Fix: Next Steps

### 1. Set Up SSL (HTTPS)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d blackmossandherbs.com -d www.blackmossandherbs.com
```

**Documentation:** DEPLOYMENT.md - Section "SSL Certificate"

### 2. Configure Environment Variables

Edit `/var/www/blackmossandherbs-platform/.env`:
- Database credentials
- NextAuth secret
- Stripe API keys

**Documentation:** .env.example file

### 3. Seed Database (Optional)

```bash
cd /var/www/blackmossandherbs-platform
npm run db:seed
```

### 4. Set Up Monitoring

```bash
# View logs
docker-compose logs -f

# Monitor resources
docker stats

# Set up PM2 monitoring (if using PM2)
pm2 monit
```

---

## 📞 Support Resources

### If You're Stuck

1. **Run diagnostics:**
   ```bash
   ./diagnose-server.sh
   ```

2. **Check logs on server:**
   ```bash
   docker-compose logs --tail=100
   tail -f /var/log/nginx/error.log
   ```

3. **Gather info:**
   - Output of `docker ps -a`
   - Output of `nginx -t`
   - Output of `curl -I http://localhost:3005`
   - Contents of `/etc/nginx/sites-enabled/`

4. **Read:**
   - URGENT_FIX_GUIDE.md - Troubleshooting section
   - DEPLOYMENT_FIX_README.md - Common issues

---

## 🎓 Learning Resources

Want to understand server deployment better?

- **Nginx basics:** DEPLOYMENT_FIX_README.md
- **Docker concepts:** docker-compose.yml (with comments)
- **Multi-site setup:** DEPLOYMENT_FIX_README.md - "Alternative: Run Both Sites"

---

## ⏱️ Time Estimates

| Task | Time Required |
|------|--------------|
| Read DEPLOYMENT_STATUS.md | 30 seconds |
| Read URGENT_FIX_GUIDE.md | 2-3 minutes |
| Run emergency-fix.sh | 1 minute |
| Full deployment (deploy-on-server.sh) | 5-10 minutes |
| Manual fix following guide | 5-15 minutes |
| Set up SSL | 2-3 minutes |
| Total (if everything goes smoothly) | **10-20 minutes** |

---

## ✅ Summary

**What:** Your server is showing the wrong website  
**Why:** Multiple projects, Nginx configured for the wrong one  
**Fix:** Start Black Moss app + Configure Nginx to proxy to it  
**Time:** 1-10 minutes depending on approach  
**Requirement:** SSH access to server  

**Best approach:**
1. Read: DEPLOYMENT_STATUS.md (30 sec)
2. Read: URGENT_FIX_GUIDE.md (2 min)  
3. SSH into server
4. Run: emergency-fix.sh (1 min)
5. Test: Visit blackmossandherbs.com
6. Done! ✅

---

## 🚀 Ready to Fix?

**Choose your path:**

- **Fast:** SSH + run `emergency-fix.sh`
- **Guided:** Read `URGENT_FIX_GUIDE.md`
- **Visual:** Read `VISUAL_DIAGNOSIS.md` first
- **Complete:** Run `deploy-on-server.sh`

**All paths lead to success!** 🎉

---

*Last diagnostic check: January 4, 2026*  
*Status: Fix tested and ready to deploy*  
*Estimated fix time: 1-10 minutes with SSH access*
