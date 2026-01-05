# 🚀 Quick Deployment Guide

## One-Command Deployment

```bash
ssh root@213.199.45.126 "cd /var/www/blackmossandherbs-platform && git pull && ./fix-deployment.sh"
```

## Manual Deployment Steps

1. **SSH into server**
   ```bash
   ssh root@213.199.45.126
   ```

2. **Navigate to app directory**
   ```bash
   cd /var/www/blackmossandherbs-platform
   ```

3. **Pull latest code**
   ```bash
   git pull origin main
   ```

4. **Run deployment fix**
   ```bash
   chmod +x fix-deployment.sh
   ./fix-deployment.sh
   ```

5. **Verify deployment**
   ```bash
   curl http://localhost:3000/api/health
   pm2 status
   ```

## Health Checks

- **Application:** `curl http://localhost:3000/api/health`
- **Readiness:** `curl http://localhost:3000/api/ready`
- **PM2:** `pm2 status`
- **Nginx:** `systemctl status nginx`

## Troubleshooting

See `FIX_DEPLOYMENT.md` for detailed troubleshooting guide.

## Documentation

- **Full Deployment:** `DEPLOYMENT.md`
- **Production Runbook:** `PRODUCTION_RUNBOOK.md`
- **Security:** `SECURITY.md`
- **API Docs:** `API.md`
- **Enterprise Audit:** `AUDIT_REPORT.md`
