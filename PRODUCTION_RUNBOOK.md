# Production Runbook
## Black Moss & Herbs Platform

**Last Updated:** $(date)  
**Version:** 1.0.0  
**Environment:** Production

---

## Quick Reference

### Emergency Contacts
- **Server IP:** 213.199.45.126
- **Domain:** blackmossandherbs.com
- **SSH:** `ssh root@213.199.45.126`
- **App Directory:** `/var/www/blackmossandherbs-platform`

### Critical Commands

```bash
# Check application status
pm2 status
pm2 logs blackmossandherbs --lines 50

# Check nginx
systemctl status nginx
nginx -t

# Check database
systemctl status postgresql
psql -U dbuser -d blackmossandherbs -c "SELECT 1"

# Health check
curl http://localhost:3000/api/health
curl http://localhost:3000/api/ready

# Restart services
pm2 restart blackmossandherbs
systemctl restart nginx
systemctl restart postgresql
```

---

## Common Issues & Solutions

### Issue: Website is Down

**Symptoms:**
- Site returns 502/503 error
- Site times out
- Health check fails

**Diagnosis:**
```bash
# 1. Check PM2 status
pm2 status

# 2. Check application logs
pm2 logs blackmossandherbs --lines 100

# 3. Check nginx status
systemctl status nginx
tail -f /var/log/nginx/error.log

# 4. Check health endpoint
curl http://localhost:3000/api/health

# 5. Check database
systemctl status postgresql
```

**Solutions:**

1. **PM2 Process Stopped**
   ```bash
   pm2 restart blackmossandherbs
   pm2 save
   ```

2. **Nginx Not Running**
   ```bash
   systemctl start nginx
   systemctl status nginx
   ```

3. **Port Conflict**
   ```bash
   lsof -i :3000
   # Kill conflicting process or change port
   ```

4. **Database Connection Issue**
   ```bash
   systemctl restart postgresql
   # Check .env file for correct DATABASE_URL
   ```

5. **Full Redeploy**
   ```bash
   cd /var/www/blackmossandherbs-platform
   git pull origin main
   ./fix-deployment.sh
   ```

---

### Issue: High Memory Usage

**Symptoms:**
- Application crashes
- Slow response times
- PM2 restarts frequently

**Diagnosis:**
```bash
# Check memory usage
free -h
pm2 monit
htop
```

**Solutions:**

1. **Restart Application**
   ```bash
   pm2 restart blackmossandherbs
   ```

2. **Check for Memory Leaks**
   ```bash
   pm2 logs blackmossandherbs | grep -i "memory\|leak\|error"
   ```

3. **Increase PM2 Memory Limit**
   ```bash
   pm2 delete blackmossandherbs
   pm2 start npm --name "blackmossandherbs" -- start --max-memory-restart 2G
   pm2 save
   ```

---

### Issue: Database Connection Errors

**Symptoms:**
- 500 errors on database queries
- "Connection refused" errors
- Health check shows database disconnected

**Diagnosis:**
```bash
# Check PostgreSQL status
systemctl status postgresql

# Test connection
psql -U dbuser -d blackmossandherbs -h localhost

# Check connection pool
netstat -an | grep 5432
```

**Solutions:**

1. **PostgreSQL Not Running**
   ```bash
   systemctl start postgresql
   systemctl enable postgresql
   ```

2. **Connection Pool Exhausted**
   ```bash
   # Restart PostgreSQL to clear connections
   systemctl restart postgresql
   ```

3. **Wrong Credentials**
   ```bash
   # Check .env file
   cat /var/www/blackmossandherbs-platform/.env | grep DATABASE_URL
   ```

---

### Issue: Stripe Webhook Failures

**Symptoms:**
- Payments not processing
- Subscriptions not activating
- Webhook errors in logs

**Diagnosis:**
```bash
# Check webhook logs
pm2 logs blackmossandherbs | grep -i "webhook\|stripe"

# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/stripe
```

**Solutions:**

1. **Check Webhook Secret**
   ```bash
   # Verify STRIPE_WEBHOOK_SECRET in .env
   cat .env | grep STRIPE_WEBHOOK_SECRET
   ```

2. **Verify Stripe Configuration**
   - Check Stripe dashboard for webhook URL
   - Verify webhook secret matches
   - Check webhook events are enabled

---

## Deployment Procedures

### Standard Deployment

```bash
# 1. SSH into server
ssh root@213.199.45.126

# 2. Navigate to app directory
cd /var/www/blackmossandherbs-platform

# 3. Pull latest code
git pull origin main

# 4. Run deployment script
./fix-deployment.sh

# 5. Verify deployment
curl http://localhost:3000/api/health
pm2 status
```

### Emergency Rollback

```bash
# 1. Find previous working commit
cd /var/www/blackmossandherbs-platform
git log --oneline -10

# 2. Checkout previous commit
git checkout <commit-hash>

# 3. Redeploy
./fix-deployment.sh

# 4. Verify
curl http://localhost:3000/api/health
```

---

## Backup & Restore

### Create Backup

```bash
# Automated backup (runs daily via cron)
/var/www/blackmossandherbs-platform/scripts/backup-database.sh

# Manual backup
cd /var/www/blackmossandherbs-platform
./scripts/backup-database.sh
```

### Restore Backup

```bash
# Interactive restore
cd /var/www/blackmossandherbs-platform
./scripts/restore-database.sh

# Follow prompts to select backup
```

**Backup Location:** `/var/backups/blackmossandherbs/`  
**Retention:** 30 days

---

## Monitoring

### Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# Readiness check
curl http://localhost:3000/api/ready

# Full system check
/var/monitoring/blackmossandherbs/full-check.sh
```

### Log Locations

- **Application Logs:** `pm2 logs blackmossandherbs`
- **Nginx Access:** `/var/log/nginx/access.log`
- **Nginx Error:** `/var/log/nginx/error.log`
- **PostgreSQL:** `/var/log/postgresql/`
- **System:** `/var/log/syslog`

---

## Performance Optimization

### Database Optimization

```bash
# Analyze database
psql -U dbuser -d blackmossandherbs -c "ANALYZE;"

# Check slow queries
# Enable slow query log in PostgreSQL config
```

### Application Optimization

```bash
# Enable PM2 cluster mode
pm2 delete blackmossandherbs
pm2 start ecosystem.config.js
pm2 save
```

### Nginx Optimization

- Gzip compression: ✅ Enabled
- Caching: ✅ Configured
- Rate limiting: ✅ Active

---

## Security Procedures

### SSL Certificate Renewal

```bash
# Certbot auto-renewal (automatic)
certbot renew --dry-run

# Manual renewal
certbot renew
systemctl reload nginx
```

### Security Updates

```bash
# Update system packages
apt update && apt upgrade -y

# Update Node.js dependencies
cd /var/www/blackmossandherbs-platform
npm audit
npm update
npm run build
pm2 restart blackmossandherbs
```

### Firewall Management

```bash
# Check firewall status
ufw status

# Allow/deny ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
```

---

## Maintenance Windows

### Recommended Maintenance Schedule

- **Daily:** Automated backups
- **Weekly:** Log rotation, health checks
- **Monthly:** Security updates, dependency updates
- **Quarterly:** Full system audit

### Maintenance Checklist

- [ ] Verify backups are running
- [ ] Check disk space
- [ ] Review error logs
- [ ] Update dependencies
- [ ] Test restore procedure
- [ ] Review security logs
- [ ] Check SSL certificate expiration

---

## Escalation Procedures

### Severity Levels

**P0 - Critical (Site Down)**
- Immediate response required
- All hands on deck
- Use emergency rollback if needed

**P1 - High (Major Feature Broken)**
- Response within 1 hour
- Workaround available
- Fix in next deployment

**P2 - Medium (Minor Issues)**
- Response within 24 hours
- Document issue
- Plan fix for next sprint

**P3 - Low (Enhancements)**
- Response within 1 week
- Add to backlog
- Prioritize with team

---

## Post-Incident Review

After resolving an incident:

1. Document what happened
2. Identify root cause
3. Implement preventive measures
4. Update this runbook
5. Share learnings with team

---

## Quick Links

- **GitHub Repository:** https://github.com/richhabits/blackmossandherbs-platform
- **Deployment Guide:** `DEPLOYMENT.md`
- **Security Policy:** `SECURITY.md`
- **API Documentation:** `API.md`
- **Troubleshooting:** `FIX_DEPLOYMENT.md`

---

**Remember:** When in doubt, check the logs first!
