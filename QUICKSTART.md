# 🚀 Quick Start Guide

## For Your Server

### 1. Fresh Server Setup + Deploy

`auto-deploy.sh` bootstraps a fresh Ubuntu server (Node, PostgreSQL, Nginx, PM2), clones the repo, configures `.env`, and deploys — all in one interactive run:

```bash
# SSH into your server
ssh root@your-server-ip

# Download and run
wget https://raw.githubusercontent.com/richhabits/blackmossandherbs-platform/main/auto-deploy.sh
chmod +x auto-deploy.sh
./auto-deploy.sh
```

### 2. Redeploying Later

For an existing deployment (pull latest code, rebuild, restart — auto-detects Docker vs PM2):

```bash
cd /var/www/blackmossandherbs-platform
chmod +x fix-server.sh
./fix-server.sh
```

### 3. Setup SSL

```bash
chmod +x setup-ssl.sh
./setup-ssl.sh
```

### 4. Configure Nginx

```bash
# Copy nginx config
cp nginx.conf /etc/nginx/nginx.conf

# Update domain in config
nano /etc/nginx/nginx.conf

# Test and restart
nginx -t
systemctl restart nginx
```

## Done! 🎉

Your site is now live at https://yourdomain.com

## Cost: ~$5-10/month

- Server: $5/month (DigitalOcean/Linode/Vultr)
- Domain: $10/year
- SSL: FREE (Let's Encrypt)

## Support

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.
