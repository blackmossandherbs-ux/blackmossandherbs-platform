# 🔍 VISUAL DIAGNOSIS: What's Wrong with Your Server

## Current State (BROKEN) ❌

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        blackmossandherbs.com (DNS)
                     │
                     │ Points to IP
                     ▼
         ┌───────────────────────┐
         │  213.199.45.126       │
         │  (Your VPS Server)    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Nginx (Port 80)     │
         │   ┌───────────────┐   │
         │   │ Configured to │   │
         │   │ proxy to:     │   │
         │   │ Port 3000 ❌  │   │◄── WRONG PORT!
         │   └───────────────┘   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Hectic Radio (3000)   │
         │ Status: Running ✅    │
         │ Content: DJ Danny     │
         └───────────────────────┘
                     
         ┌───────────────────────┐
         │ Black Moss (3005)     │
         │ Status: STOPPED ❌    │
         │ Content: Your Site    │
         └───────────────────────┘
              ▲
              │
              └─── This is what should be running!
```

**Result:** Visitors see Hectic Radio instead of Black Moss & Herbs

---

## What Should Happen (CORRECT) ✅

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        blackmossandherbs.com (DNS)
                     │
                     │ Points to IP
                     ▼
         ┌───────────────────────┐
         │  213.199.45.126       │
         │  (Your VPS Server)    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Nginx (Port 80)     │
         │   ┌───────────────┐   │
         │   │ Configured to │   │
         │   │ proxy to:     │   │
         │   │ Port 3005 ✅  │   │◄── CORRECT PORT!
         │   └───────────────┘   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Black Moss (3005)     │
         │ Status: Running ✅    │
         │ Content: Your Site    │
         └───────────────────────┘
              ▲
              │
              └─── This is now active!
                     
         ┌───────────────────────┐
         │ Hectic Radio (3000)   │
         │ Status: Stopped       │
         │ (or on different      │
         │  domain)              │
         └───────────────────────┘
```

**Result:** Visitors see Black Moss & Herbs ✅

---

## Port Scan Results

```
Port Status on 213.199.45.126:

22  (SSH)         ✅ OPEN   - Can connect to server
80  (HTTP)        ✅ OPEN   - Nginx is working
443 (HTTPS)       ❌ CLOSED - SSL not configured yet
3000 (Hectic)     ✅ OPEN   - Hectic Radio is running
3005 (Black Moss) ❌ CLOSED - Black Moss is NOT running
```

---

## The Fix Explained

### Step 1: Start Black Moss Application

```bash
cd /var/www/blackmossandherbs-platform
docker-compose up -d

# This starts:
# ┌─────────────────────────┐
# │ blackmoss-db (postgres) │
# │ Port: 5432              │
# └─────────────────────────┘
#           ▲
#           │ connects to
#           │
# ┌─────────────────────────┐
# │ blackmoss-app (Next.js) │
# │ Port: 3005              │
# └─────────────────────────┘
```

**Result:** Port 3005 is now OPEN ✅

### Step 2: Stop Conflicting Services

```bash
docker stop $(docker ps | grep -v blackmoss | awk 'NR>1 {print $1}')

# Stops Hectic Radio
# ┌─────────────────────────┐
# │ hectic-app              │
# │ Port: 3000              │
# │ Status: STOPPED         │
# └─────────────────────────┘
```

### Step 3: Configure Nginx

```bash
# Remove old config
rm /etc/nginx/sites-enabled/hectic*

# Add Black Moss config
ln -s /etc/nginx/sites-available/blackmossandherbs.com \
      /etc/nginx/sites-enabled/

# Nginx config now says:
# "When someone visits blackmossandherbs.com,
#  proxy to http://localhost:3005"
```

### Step 4: Restart Nginx

```bash
systemctl restart nginx

# Nginx reloads and now:
# blackmossandherbs.com → Port 3005 ✅
```

---

## Network Flow After Fix

```
User Browser
    │
    │ http://blackmossandherbs.com
    ▼
DNS Server
    │
    │ Returns: 213.199.45.126
    ▼
Your Server (213.199.45.126)
    │
    │ Request arrives at Port 80
    ▼
Nginx
    │
    │ Checks: "blackmossandherbs.com?"
    │ Config says: "Proxy to port 3005"
    ▼
Black Moss App (Port 3005)
    │
    │ Processes request
    │ Returns HTML
    ▼
Nginx
    │
    │ Forwards response
    ▼
User Browser
    │
    │ Displays: Black Moss & Herbs ✅
    └────────────────────────────────
```

---

## File Structure on Server

```
/var/www/
├── blackmossandherbs-platform/     ← Your project
│   ├── docker-compose.yml          ← Defines containers
│   ├── config/
│   │   └── blackmoss.nginx.conf    ← Nginx config
│   ├── .env                        ← Environment vars
│   └── ...
│
└── hectic-radio/                   ← Other project (optional)
    └── ...

/etc/nginx/
├── sites-available/
│   ├── blackmossandherbs.com       ← Config file
│   └── hecticradio.com             ← Other project config
│
└── sites-enabled/
    └── blackmossandherbs.com       ← Active (symlink)
        └─→ points to sites-available/blackmossandherbs.com
```

---

## Docker Containers After Fix

```bash
$ docker ps

CONTAINER ID   IMAGE              STATUS    PORTS                    NAMES
abc123         postgres:15        Up        0.0.0.0:5435->5432/tcp   blackmoss-db
def456         blackmoss-app      Up        0.0.0.0:3005->3000/tcp   blackmoss-app
```

✅ Both containers running
✅ Port 3005 exposed
✅ Database connected

---

## Verification Commands

### On Server

```bash
# 1. Check containers
docker ps
# Should show: blackmoss-app and blackmoss-db

# 2. Test app directly
curl -I http://localhost:3005
# Should return: HTTP/1.1 200 OK

# 3. Test nginx proxy
curl http://localhost | grep title
# Should show: <title>Black Moss...</title>

# 4. Test from domain
curl http://blackmossandherbs.com | grep title
# Should show: <title>Black Moss...</title>
```

### From Your Computer

```bash
# Should show Black Moss content
curl http://blackmossandherbs.com | grep -i "title\|black\|moss"

# Should NOT show Hectic Radio
curl http://blackmossandherbs.com | grep -i "hectic\|danny"
# (should return nothing)
```

---

## Common Mistakes to Avoid

### ❌ Wrong Port in Nginx

```nginx
# WRONG - Points to Hectic Radio
proxy_pass http://127.0.0.1:3000;
```

```nginx
# CORRECT - Points to Black Moss
proxy_pass http://127.0.0.1:3005;
```

### ❌ Multiple Configs for Same Domain

```bash
# Bad - conflicting configs
/etc/nginx/sites-enabled/
├── default              ← Remove this
├── blackmossandherbs    ← Keep this
└── hectic-config        ← Remove if it uses same domain
```

### ❌ App Not Running

```bash
# Check if running
docker ps | grep blackmoss

# If not listed, start it
cd /var/www/blackmossandherbs-platform
docker-compose up -d
```

---

## Summary

| What | Before (Broken) | After (Fixed) |
|------|----------------|---------------|
| Port 3005 | ❌ Closed | ✅ Open |
| Black Moss App | ❌ Not running | ✅ Running |
| Nginx Config | ❌ Points to 3000 | ✅ Points to 3005 |
| Website Shows | ❌ Hectic Radio | ✅ Black Moss |
| Visitors See | ❌ Wrong site | ✅ Correct site |

---

**Bottom line:** Start Black Moss app (port 3005) + Configure Nginx to proxy to it = Problem solved! 🎉
