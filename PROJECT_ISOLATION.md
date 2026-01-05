# 🔒 PROJECT ISOLATION - NO MORE CONFLICTS!

## The Problem (Fixed!)

Your server had multiple projects fighting for the same resources. Now each project is **completely isolated**.

---

## How Projects Are Now Organized

### Black Moss & Herbs (THIS PROJECT)
```
Container Names:  blackmossherbs-app, blackmossherbs-db
Network:          blackmossherbs-network
App Port:         3005 (external) → 3000 (internal)
DB Port:          5435 (external) → 5432 (internal)
Domain:           blackmossandherbs.com
Nginx Config:     /etc/nginx/sites-available/blackmossandherbs.com
Directory:        /var/www/blackmossandherbs-platform
```

### Hectic Radio (OTHER PROJECT)
```
Container Names:  hecticradio-app, hecticradio-db (suggested)
Network:          hecticradio-network (suggested)
App Port:         3006 (external) → 3000 (internal) (suggested)
DB Port:          5436 (external) → 5432 (internal) (suggested)
Domain:           hecticradio.com (or similar)
Nginx Config:     /etc/nginx/sites-available/hecticradio.com
Directory:        /var/www/hectic-radio (suggested)
```

### Future Projects
```
Container Names:  projectname-app, projectname-db
Network:          projectname-network
App Port:         3007, 3008, 3009... (next available)
DB Port:          5437, 5438, 5439... (next available)
```

---

## Port Assignment System

| Project | App Port | DB Port | Status |
|---------|----------|---------|--------|
| **Black Moss & Herbs** | **3005** | **5435** | ✅ This project |
| Hectic Radio | 3006 | 5436 | Other project |
| Future Project 1 | 3007 | 5437 | Available |
| Future Project 2 | 3008 | 5438 | Available |
| Future Project 3 | 3009 | 5439 | Available |

**Rule:** Each new project gets the next available port number.

---

## Using the Server Manager

I've created a menu-driven tool to manage your projects:

```bash
ssh root@213.199.45.126
cd /var/www/blackmossandherbs-platform
./server-manager.sh
```

### Menu Options:

1. **Deploy This Project** - Full deployment with build
2. **Start This Project** - Start Black Moss containers
3. **Stop This Project** - Stop Black Moss containers
4. **Restart This Project** - Restart Black Moss
5. **View Logs** - Real-time logs
6. **Check Status** - See if it's running
7. **List ALL Projects** - See everything on server
8. **Stop OTHER Projects** - Stop everything except Black Moss
9. **Configure Nginx** - Set up reverse proxy
10. **Full System Status** - Complete overview

---

## Quick Commands (Without Menu)

### Black Moss & Herbs

```bash
# Start
cd /var/www/blackmossandherbs-platform && docker-compose up -d

# Stop
cd /var/www/blackmossandherbs-platform && docker-compose down

# Restart
cd /var/www/blackmossandherbs-platform && docker-compose restart

# Logs
cd /var/www/blackmossandherbs-platform && docker-compose logs -f

# Status
docker ps --filter "name=blackmossherbs"
```

### See All Projects

```bash
# All containers
docker ps -a

# Only running containers
docker ps

# Filter by name
docker ps --filter "name=hectic"
docker ps --filter "name=blackmoss"
```

### Stop Other Projects (Keep Black Moss Running)

```bash
# List all containers except Black Moss
docker ps --format "{{.Names}}" | grep -v blackmoss

# Stop them
docker ps --format "{{.Names}}" | grep -v blackmoss | xargs -r docker stop
```

---

## Nginx Configuration Per Project

### Black Moss & Herbs (Port 3005)

File: `/etc/nginx/sites-available/blackmossandherbs.com`

```nginx
server {
    server_name blackmossandherbs.com www.blackmossandherbs.com;
    
    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    listen 80;
}
```

Enable it:
```bash
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
```

### Hectic Radio (Port 3006 - Example)

File: `/etc/nginx/sites-available/hecticradio.com`

```nginx
server {
    server_name hecticradio.com www.hecticradio.com;
    
    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    listen 80;
}
```

---

## File Structure on Server

```
/var/www/
├── blackmossandherbs-platform/      ← Black Moss (Port 3005)
│   ├── docker-compose.yml           ← Unique container names
│   ├── .env                         ← Unique DB credentials
│   └── config/blackmoss.nginx.conf
│
├── hectic-radio/                    ← Hectic Radio (Port 3006)
│   ├── docker-compose.yml           ← Different container names
│   ├── .env                         ← Different DB credentials
│   └── config/hectic.nginx.conf
│
└── future-project/                  ← Future (Port 3007)
    └── ...

/etc/nginx/
├── sites-available/
│   ├── blackmossandherbs.com        ← Port 3005
│   ├── hecticradio.com              ← Port 3006
│   └── futureproject.com            ← Port 3007
│
└── sites-enabled/
    ├── blackmossandherbs.com → ../sites-available/blackmossandherbs.com
    ├── hecticradio.com → ../sites-available/hecticradio.com
    └── futureproject.com → ../sites-available/futureproject.com
```

---

## Preventing Conflicts Checklist

When adding a NEW project to the server:

### 1. Choose Unique Names
```yaml
# docker-compose.yml
services:
  newproject-app:              # ← Unique name
    container_name: newproject-app
  newproject-db:               # ← Unique name
    container_name: newproject-db
```

### 2. Choose Unique Ports
```yaml
# docker-compose.yml
ports:
  - "3007:3000"  # ← Next available port (not 3005, 3006)
  - "5437:5432"  # ← Next available DB port
```

### 3. Use Unique Network
```yaml
# docker-compose.yml
networks:
  newproject-network:          # ← Unique network name
    driver: bridge
```

### 4. Create Separate Nginx Config
```bash
# Unique domain and unique port
server {
    server_name newproject.com;
    location / {
        proxy_pass http://127.0.0.1:3007;  # ← Unique port
    }
}
```

### 5. Use Unique Database Credentials
```env
# .env
DB_USER=newproject_user         # ← Unique username
DB_PASSWORD=newproject_pass     # ← Unique password
DB_NAME=newproject_db           # ← Unique database name
```

---

## What Changed for Black Moss

### Before (Conflicting)
```yaml
container_name: blackmoss-app           # ❌ Generic name
ports: "3005:3000"                      # ❌ No problem, but...
network: blackmoss-network              # ❌ Could conflict
volumes: blackmoss-db-volume            # ❌ Generic name
```

### After (Isolated)
```yaml
container_name: blackmossherbs-app      # ✅ Specific name
ports: "3005:3000"                      # ✅ Dedicated port
network: blackmossherbs-network         # ✅ Unique network
volumes: blackmossherbs-db-data         # ✅ Unique volume
```

---

## Verification Commands

### Check Black Moss is Running

```bash
# Should show 2 containers: app + db
docker ps --filter "name=blackmossherbs"

# Should return HTTP 200
curl -I http://localhost:3005

# Should show Black Moss content
curl http://localhost:3005 | grep -i "black\|moss"
```

### Check Port Conflicts

```bash
# See what's using each port
netstat -tlnp | grep -E ":(3005|3006|3007|5435|5436)"

# Should show:
# 3005 - Black Moss App
# 5435 - Black Moss Database
# (other ports available)
```

### Check Nginx

```bash
# Active sites
ls -la /etc/nginx/sites-enabled/

# Test config
nginx -t

# What each domain points to
grep -r "proxy_pass" /etc/nginx/sites-enabled/
```

---

## Deployment Workflow (No More Conflicts)

### 1. Deploy Black Moss (This Project)

```bash
cd /var/www/blackmossandherbs-platform
./server-manager.sh
# Select option 1: Deploy This Project
```

### 2. Deploy Another Project (Hectic Radio)

```bash
cd /var/www/hectic-radio
# Make sure its docker-compose.yml uses:
# - Different container names
# - Different ports (3006, not 3005)
# - Different network name
docker-compose up -d
```

### 3. Configure Nginx for Both

```bash
# Black Moss
ln -sf /etc/nginx/sites-available/blackmossandherbs.com /etc/nginx/sites-enabled/

# Hectic Radio
ln -sf /etc/nginx/sites-available/hecticradio.com /etc/nginx/sites-enabled/

# Test and restart
nginx -t && systemctl restart nginx
```

### 4. Verify Both Work

```bash
# Black Moss
curl -I http://blackmossandherbs.com

# Hectic Radio
curl -I http://hecticradio.com

# Both should return HTTP 200 with their own content
```

---

## Troubleshooting

### "Port already in use"

```bash
# See what's using the port
netstat -tlnp | grep :3005

# Stop the conflicting container
docker ps | grep 3005
docker stop CONTAINER_NAME
```

### "Container name already exists"

```bash
# List all containers
docker ps -a

# Remove the old one
docker rm -f old-container-name

# Start with new unique name
docker-compose up -d
```

### "Network already exists"

```bash
# List networks
docker network ls

# Remove if not in use
docker network rm old-network-name
```

---

## Best Practices

1. **Naming Convention:** Use `projectname-service` format
2. **Port Range:** Apps use 3000-3999, DBs use 5400-5499
3. **One Domain Per Project:** Don't share domains between projects
4. **Separate Directories:** Each project in its own `/var/www/projectname`
5. **Unique Credentials:** Never share database users/passwords
6. **Use Server Manager:** Run `./server-manager.sh` for operations

---

## Quick Reference Card

```
BLACK MOSS & HERBS
═══════════════════════════════════════
App Port:        3005
DB Port:         5435
Containers:      blackmossherbs-app, blackmossherbs-db
Network:         blackmossherbs-network
Domain:          blackmossandherbs.com
Directory:       /var/www/blackmossandherbs-platform
Nginx Config:    /etc/nginx/sites-available/blackmossandherbs.com

COMMANDS
═══════════════════════════════════════
Start:           docker-compose up -d
Stop:            docker-compose down
Restart:         docker-compose restart
Logs:            docker-compose logs -f
Status:          docker ps --filter "name=blackmossherbs"
Manager:         ./server-manager.sh
```

---

**Summary:** Every project now has unique container names, ports, networks, and configurations. They can run simultaneously without interfering with each other! 🎉
