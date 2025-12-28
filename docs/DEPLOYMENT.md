# Deployment Guide

This guide covers deploying BlackMoss & Herbs to production.

## Prerequisites

- Server with Docker and Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Environment variables configured

## Quick Deployment

### 1. Server Setup

```bash
# Clone repository
git clone <repository-url>
cd blackmoss-and-herbs

# Copy environment file
cp .env.example .env

# Edit with production values
nano .env
```

### 2. Configure Environment

Key production variables:

```bash
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-random-secret>
DATABASE_URL=postgresql://user:pass@postgres:5432/blackmoss_herbs
REDIS_URL=redis://redis:6379
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 3. Deploy

```bash
# Start all services
./scripts/prod-up.sh

# Run migrations
./scripts/migrate.sh

# Seed initial data (optional)
./scripts/seed.sh
```

## SSL/TLS Setup

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx.conf to use SSL
# Add SSL configuration to nginx/nginx.conf
```

### Nginx SSL Configuration

Update `nginx/nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # ... rest of config
}
```

## Database Backups

### Automated Backups

Set up a cron job:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/blackmoss-and-herbs/scripts/backup.sh
```

### Manual Backup

```bash
./scripts/backup.sh
```

### Restore Backup

```bash
./scripts/restore.sh backups/backup_20240101_120000.sql.gz
```

## Monitoring

### Health Checks

All services include health checks. Monitor with:

```bash
docker-compose ps
```

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f web
```

### Sentry Setup

1. Create Sentry project
2. Add `SENTRY_DSN` to `.env`
3. Configure error tracking in code

## Scaling

### Horizontal Scaling

For high traffic, consider:
- Load balancer (multiple web instances)
- Database read replicas
- Redis cluster
- CDN for static assets

### Vertical Scaling

Increase resources:
- Database: More RAM, SSD storage
- Redis: More memory
- Web: More CPU/RAM

## Updates

```bash
# Pull latest code
git pull

# Rebuild and restart
./scripts/prod-down.sh
./scripts/prod-up.sh

# Run migrations if needed
./scripts/migrate.sh
```

## Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Check service status
docker-compose ps

# Restart services
docker-compose restart
```

### Database connection issues

```bash
# Check Postgres is running
docker-compose exec postgres pg_isready

# Check connection string
echo $DATABASE_URL
```

### Out of memory

```bash
# Check memory usage
docker stats

# Increase Docker memory limit
# Edit docker-compose.yml or Docker settings
```

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong secrets in `.env`
- [ ] Enable SSL/TLS
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Enable 2FA for admin
- [ ] Review audit logs regularly
- [ ] Keep dependencies updated
- [ ] Monitor for security alerts
