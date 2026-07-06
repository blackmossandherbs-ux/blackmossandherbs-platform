#!/bin/bash
# Black Moss & Herbs — Server Fix Script
# Run on server as root: bash fix-server.sh
set -e

DOMAIN="blackmossandherbs.com"
APP_DIR="/var/www/blackmossandherbs-platform"
APP_NAME="blackmossandherbs"
NGINX_SITE_CONF="/etc/nginx/sites-available/$DOMAIN"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[!!]${NC} $1"; }
fail() { echo -e "${RED}[XX]${NC} $1"; exit 1; }

echo ""; echo "============================================"
echo "  Black Moss & Herbs — Server Fix"; echo "============================================"; echo ""

[ -d "$APP_DIR" ] || fail "App directory $APP_DIR not found."
cd "$APP_DIR"

# Pull latest code
log "Pulling latest code from main..."
git pull origin main

# Detect: Docker or PM2?
USE_DOCKER=false
APP_PORT=3000

if command -v docker &>/dev/null && docker ps --format '{{.Names}}' 2>/dev/null | grep -q "blackmoss"; then
    USE_DOCKER=true
    APP_PORT=3005
    log "Detected Docker deployment — app port: 3005"
elif command -v docker-compose &>/dev/null && [ -f docker-compose.yml ]; then
    USE_DOCKER=true
    APP_PORT=3005
    log "Detected Docker Compose deployment — app port: 3005"
else
    log "Using PM2 deployment — app port: 3000"
fi

# Build & Start
if [ "$USE_DOCKER" = true ]; then
    log "Stopping existing Docker containers..."
    docker-compose down 2>/dev/null || true
    log "Building and starting Docker containers..."
    docker-compose up -d --build
    log "Running DB migrations inside container..."
    sleep 5
    docker-compose exec -T app npx prisma generate 2>/dev/null || true
    docker-compose exec -T app npx prisma db push --accept-data-loss 2>/dev/null || true
    log "Docker containers status:"
    docker-compose ps
else
    log "Installing dependencies..."
    npm install --legacy-peer-deps
    log "Generating Prisma client & syncing DB..."
    npx prisma generate
    npx prisma db push --accept-data-loss
    log "Building Next.js application..."
    npm run build
    log "Restarting PM2..."
    if pm2 list | grep -q "$APP_NAME"; then
        pm2 restart "$APP_NAME"
    else
        pm2 start ecosystem.config.js || pm2 start npm --name "$APP_NAME" -- start
    fi
    pm2 save
    pm2 list
fi

log "Waiting for app to start..."
sleep 5

if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$APP_PORT | grep -qE "^(200|301|302|307|404)"; then
    log "App is responding on port $APP_PORT ✓"
else
    warn "App may not be ready yet. Check logs:"
    [ "$USE_DOCKER" = true ] && echo "  docker-compose logs -f app" || echo "  pm2 logs $APP_NAME"
fi

# Write nginx site config
log "Writing nginx site config..."
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
SSL_AVAILABLE=false
[ -f "$CERT_PATH/fullchain.pem" ] && [ -f "$CERT_PATH/privkey.pem" ] && SSL_AVAILABLE=true
[ "$SSL_AVAILABLE" = true ] && log "SSL certs found ✓" || warn "No SSL certs — serving HTTP. Run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"

mkdir -p /var/www/certbot

if [ "$SSL_AVAILABLE" = true ]; then
cat > "$NGINX_SITE_CONF" << NGINX_EOF
upstream blackmoss_app {
    server 127.0.0.1:${APP_PORT};
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN} ${DOMAIN%.com}.co.uk www.${DOMAIN%.com}.co.uk;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://\$host\$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};
    ssl_certificate ${CERT_PATH}/fullchain.pem;
    ssl_certificate_key ${CERT_PATH}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    client_max_body_size 20M;
    location / {
        proxy_pass http://blackmoss_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
    location /api/ {
        proxy_pass http://blackmoss_app;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
    location /_next/static/ {
        proxy_pass http://blackmoss_app;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|woff|woff2)$ {
        proxy_pass http://blackmoss_app;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN%.com}.co.uk www.${DOMAIN%.com}.co.uk;
    ssl_certificate ${CERT_PATH}/fullchain.pem;
    ssl_certificate_key ${CERT_PATH}/privkey.pem;
    return 301 https://${DOMAIN}\$request_uri;
}
NGINX_EOF
else
cat > "$NGINX_SITE_CONF" << NGINX_EOF
upstream blackmoss_app {
    server 127.0.0.1:${APP_PORT};
    keepalive 64;
}
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    client_max_body_size 20M;
    location / {
        proxy_pass http://blackmoss_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    location /_next/static/ {
        proxy_pass http://blackmoss_app;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
NGINX_EOF
fi

log "Enabling nginx site..."
ln -sf "$NGINX_SITE_CONF" /etc/nginx/sites-enabled/
[ -L /etc/nginx/sites-enabled/default ] && rm -f /etc/nginx/sites-enabled/default && warn "Removed default nginx site"
cp "$NGINX_SITE_CONF" /etc/nginx/conf.d/blackmossandherbs.conf 2>/dev/null || true

log "Testing nginx config..."
nginx -t || fail "Nginx config test failed"

log "Reloading nginx..."
systemctl reload nginx || service nginx reload

echo ""
log "============================================"
log " Deployment complete!"
log " App port: $APP_PORT | Mode: $([ "$USE_DOCKER" = true ] && echo Docker || echo PM2)"
log " Site: http${SSL_AVAILABLE:+s}://$DOMAIN"
log "============================================"
echo ""
echo "Check status:"
[ "$USE_DOCKER" = true ] && echo "  docker-compose ps" && echo "  docker-compose logs -f app" || echo "  pm2 status && pm2 logs $APP_NAME"
echo "  curl -I http://127.0.0.1:$APP_PORT"
echo "  curl -I https://$DOMAIN"
