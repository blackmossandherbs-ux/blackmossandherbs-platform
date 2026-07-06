#!/bin/bash

# SSL Setup Script for Let's Encrypt
# Run this AFTER deploying your application

set -e

echo "🔒 SSL Certificate Setup with Let's Encrypt"
echo "==========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

# Get domain name
read -p "Enter your domain name (e.g., blackmossandherbs.com): " DOMAIN
read -p "Enter www subdomain? (y/n): " WWW_DOMAIN

# Install Certbot
echo "Installing Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# Stop nginx temporarily
systemctl stop nginx

# Get certificate
if [ "$WWW_DOMAIN" == "y" ]; then
    certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN
else
    certbot certonly --standalone -d $DOMAIN
fi

# Start nginx
systemctl start nginx

# Test auto-renewal
echo "Testing auto-renewal..."
certbot renew --dry-run

echo ""
echo "✅ SSL certificate installed successfully!"
echo ""
echo "Certificate location: /etc/letsencrypt/live/$DOMAIN/"
echo "Auto-renewal is configured"
echo ""
echo "Update your Nginx config to use:"
echo "  ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;"
echo "  ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;"
