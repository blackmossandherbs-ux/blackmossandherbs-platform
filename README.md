# 🌿 Black Moss & Herbs - Herbal Wellness Platform

A full-featured eCommerce platform for herbal products, subscriptions, consultations, and wellness content.

## 🚀 Quick Deploy (Server)

```bash
ssh root@213.199.45.126
cd /var/www/blackmossandherbs-platform
./deploy-now.sh
```

That's it! Site will be live at http://blackmossandherbs.com

---

## 📦 What's Included

- **eCommerce:** Product catalog with Stripe checkout
- **Subscriptions:** 3-tier membership plans
- **Digital Library:** Premium content for members
- **Blog & Videos:** Wellness content
- **Consultations:** Booking system
- **Admin Dashboard:** Order management, analytics
- **Mobile Responsive:** Works on all devices

---

## 🔒 Multi-Project Server Setup

This project is configured to run alongside other projects without conflicts.

**Black Moss & Herbs:**
- App Port: `3005`
- DB Port: `5435`
- Containers: `blackmossherbs-app`, `blackmossherbs-db`
- Domain: `blackmossandherbs.com`

**Other projects get their own ports:** 3006, 3007, etc.

See [PROJECT_ISOLATION.md](PROJECT_ISOLATION.md) for details.

---

## 🛠️ Management Tools

### Server Manager (Interactive Menu)

```bash
./server-manager.sh
```

Options:
- Deploy/Start/Stop/Restart
- View logs
- Check status
- Manage multiple projects
- Configure Nginx

### Quick Commands

```bash
# Deploy
./deploy-now.sh

# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# Logs
docker-compose logs -f

# Status
docker ps --filter "name=blackmossherbs"
```

---

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://user:pass@blackmossherbs-db:5432/blackmossherbs"

# Auth
NEXTAUTH_URL="https://blackmossandherbs.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="https://blackmossandherbs.com"
```

### SSL Certificate (HTTPS)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d blackmossandherbs.com -d www.blackmossandherbs.com
```

---

## 📁 Project Structure

```
/
├── src/
│   ├── app/              # Next.js 13+ App Router
│   ├── components/       # React components
│   ├── lib/              # Utilities & configs
│   ├── services/         # Business logic
│   └── types/            # TypeScript types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Sample data
├── config/
│   └── blackmoss.nginx.conf  # Nginx config
├── docker-compose.yml    # Container definitions
├── deploy-now.sh         # Quick deployment
├── server-manager.sh     # Server management tool
└── README.md             # This file
```

---

## 🚢 Deployment Options

### Option 1: Docker (Recommended)

```bash
docker-compose up -d
```

### Option 2: PM2

```bash
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
```

### Option 3: Managed Deployment

```bash
./deploy-now.sh          # Simple deployment
./server-manager.sh      # Full management menu
```

---

## 📖 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[PROJECT_ISOLATION.md](PROJECT_ISOLATION.md)** - Multi-project server setup
- **[QUICKSTART.md](QUICKSTART.md)** - Fast deployment reference
- **[SERVER_READY.md](SERVER_READY.md)** - Feature overview
- **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** - Pre-launch tasks

---

## 🔧 Development

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed sample data
npm run db:seed

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🌐 Server Information

**Production Server:**
- IP: `213.199.45.126`
- Domain: `blackmossandherbs.com`
- App Port: `3005`
- Database Port: `5435`

**Tech Stack:**
- Next.js 14
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS
- Stripe
- NextAuth.js
- Docker

---

## 🔍 Troubleshooting

### App won't start

```bash
# Check logs
docker-compose logs -f

# Check if port is in use
netstat -tlnp | grep 3005

# Restart
docker-compose restart
```

### Database connection error

```bash
# Check database container
docker ps | grep postgres

# Restart database
docker-compose restart blackmossherbs-db
```

### Nginx issues

```bash
# Test config
nginx -t

# Check error log
tail -f /var/log/nginx/error.log

# Restart nginx
systemctl restart nginx
```

### Wrong site showing

This means another project is active. Use the server manager:

```bash
./server-manager.sh
# Select: "8. Stop OTHER Projects"
```

Or manually:

```bash
# See all projects
docker ps

# Stop others, keep Black Moss
docker ps --format "{{.Names}}" | grep -v blackmoss | xargs docker stop
```

---

## 🎯 Common Tasks

### Update the site

```bash
cd /var/www/blackmossandherbs-platform
git pull
./deploy-now.sh
```

### View real-time logs

```bash
docker-compose logs -f
```

### Backup database

```bash
docker exec blackmossherbs-db pg_dump -U blackmoss_user blackmossherbs > backup.sql
```

### Restore database

```bash
docker exec -i blackmossherbs-db psql -U blackmoss_user blackmossherbs < backup.sql
```

---

## 🔐 Security

- All passwords in `.env` file (not in git)
- SSL/HTTPS configured via Certbot
- Security headers in Nginx config
- Input validation via Prisma
- Authentication via NextAuth.js
- Stripe PCI compliance

---

## 📊 Monitoring

```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h

# Application logs
docker-compose logs --tail=100

# Nginx access log
tail -f /var/log/nginx/access.log
```

---

## 🆘 Support

### Quick Fixes

1. **Site down?** Run `./deploy-now.sh`
2. **Wrong site showing?** Run `./server-manager.sh` → option 8
3. **Database issues?** Run `docker-compose restart blackmossherbs-db`
4. **Nginx errors?** Run `nginx -t`

### Getting Help

Check logs and gather info:

```bash
# System status
./server-manager.sh  # Option 10: Full System Status

# Container logs
docker-compose logs --tail=100

# Nginx logs
tail -50 /var/log/nginx/error.log

# Port usage
netstat -tlnp | grep -E ":(3005|5435|80|443)"
```

---

## 📝 License

See [LICENSE](LICENSE) file.

---

## 🎉 Ready to Deploy?

```bash
ssh root@213.199.45.126
cd /var/www/blackmossandherbs-platform
./deploy-now.sh
```

**Your site will be live in ~1 minute!** 🚀

---

**For detailed setup instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)**  
**For multi-project management, see [PROJECT_ISOLATION.md](PROJECT_ISOLATION.md)**
