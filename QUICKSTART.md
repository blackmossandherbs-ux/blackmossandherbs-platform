# 🚀 Quick Start Guide

## For Your Server

### 1. Fresh Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Download and run server setup
wget https://raw.githubusercontent.com/richhabits/blackmossandherbs-platform/main/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

### 2. Clone and Deploy

```bash
# Clone repository
cd /var/www
git clone https://github.com/richhabits/blackmossandherbs-platform.git
cd blackmossandherbs-platform

# Configure environment
cp .env.example .env
nano .env  # Edit with your credentials

# Run deployment
chmod +x deploy.sh
./deploy.sh
```

### 3. Setup SSL

```bash
chmod +x setup-ssl.sh
./setup-ssl.sh
```

### 4. Configure Nginx

```bash
# For blackmossandherbs.com (uses port 3005)
cp config/blackmoss.nginx.conf /etc/nginx/sites-available/blackmoss.conf
ln -sf /etc/nginx/sites-available/blackmoss.conf /etc/nginx/sites-enabled/

# Test and restart
nginx -t
systemctl restart nginx
```

> **⚠️ Multi-Site Note**: This app runs on **port 3005** to avoid conflicts with other sites. The nginx config in `config/blackmoss.nginx.conf` is pre-configured for this.

## Done! 🎉

Your site is now live at https://yourdomain.com

## Cost: ~$5-10/month

- Server: $5/month (DigitalOcean/Linode/Vultr)
- Domain: $10/year
- SSL: FREE (Let's Encrypt)

## Support

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.
