#!/bin/bash
# Black Moss & Herbs — Server Fix Script
# Run this on the server as root: bash fix-server.sh
set -e

DOMAIN="blackmossandherbs.com"
APP_DIR="/var/www/blackmossandherbs-platform"
APP_PORT=3000
APP_NAME="blackmossandherbs"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
NGINX_SITE="/etc/nginx/sites-available/$DOMAIN"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[!!]${NC} $1"; }
fail() { echo -e "${RED}[XX]${NC} $1"; exit 1; }

echo ""
echo "============================================"
echo "  Black Moss & Herbs — Server Fix"
echo "============================================"
echo ""

# ── 1. Ensure we're in the app directory ────────────────────────────────────
[ -d "$APP_DIR" ] || fail "App directory $APP_DIR not found. Run auto-update.sh first."
cd "$APP_DIR"

# ── 2. Pull latest code ──────────────────────────────────────────────────────
log "Pulling latest code from main..."
git pull origin main

# ── 3. Install dependencies & build ─────────────────────────────────────────
log "Installing dependencies..."
npm install --legacy-peer-deps

log "Generating Prisma client..."
npx prisma generate

log "Syncing database schema..."
npx prisma db push --accept-data-loss

log "Building Next.js application..."
npm run build

# ── 4. Ensure PM2 is running ─────────────────────────────────────────────────
if pm2 list | grep -q "$APP_NAME"; then
    log "Restarting PM2 process: $APP_NAME"
    pm2 restart "$APP_NAME"
else
    log "Starting PM2 process: $APP_NAME"
    pm2 start ecosystem.config.js || pm2 start npm --name "$APP_NAME" -- start
fi
pm2 save
log "PM2 status:"
pm2 list

# Give app time to start
sleep 3

# Verify app is responding
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$APP_PORT | grep -qE "^(200|301|302|307|404)"; then
    log "App is responding on port $APP_PORT"
else
    warn "App may not be ready yet — check: pm2 logs $APP_NAME"
fi

# ── 5. Write nginx site config ───────────────────────────────────────────────
log "Writing nginx site config..."

SSL_AVAILABLE=false
if [ -f "$CERT_PATH/fullchain.pem" ] && [ -f "$CERT_PATH/privkey.pem" ]; then
    SSL_AVAILABLE=true
    log "Found SSL certs at $CERT_PATH"
else
    warn "No SSL certs found at $CERT_PATH — serving HTTP only. Run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

mkdir -p /var/www/certbot

if [ "$SSL_AVAILABLE" = true ]; then
cat > "$NGINX_SITE" << NGINX_EOF
upstream blackmoss_app {
    server 127.0.0.1:${APP_PORT};
    keepalive 64;
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS server
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

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;

    client_max_body_size 20M;

    # Rate limiting zones
    limit_req_zone \$binary_remote_addr zone=general_${APP_NAME}:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=api_${APP_NAME}:10m rate=5r/s;

    # Next.js app
    location / {
        limit_req zone=general_${APP_NAME} burst=30 nodelay;
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

    # API rate limiting
    location /api/ {
        limit_req zone=api_${APP_NAME} burst=20 nodelay;
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

    # Next.js static assets — long cache
    location /_next/static/ {
        proxy_pass http://blackmoss_app;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public images
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|woff|woff2)$ {
        proxy_pass http://blackmoss_app;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
NGINX_EOF

else

# HTTP only (no SSL yet)
cat > "$NGINX_SITE" << NGINX_EOF
upstream blackmoss_app {
    server 127.0.0.1:${APP_PORT};
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

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

# ── 6. Enable site, disable default ─────────────────────────────────────────
log "Enabling site in nginx..."
ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/

# Disable default if it's blocking our domain
if [ -f /etc/nginx/sites-enabled/default ]; then
    warn "Disabling default nginx site (was blocking custom domains)"
    rm -f /etc/nginx/sites-enabled/default
fi

# ── 7. Test and reload nginx ─────────────────────────────────────────────────
log "Testing nginx config..."
nginx -t || fail "Nginx config test failed — check errors above"

log "Reloading nginx..."
systemctl reload nginx

# ── 8. SSL setup prompt ──────────────────────────────────────────────────────
if [ "$SSL_AVAILABLE" = false ]; then
    echo ""
    warn "============================================"
    warn " Site is live on HTTP only."
    warn " To add HTTPS (free SSL), run:"
    warn ""
    warn "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    warn ""
    warn " Then run this script again."
    warn "============================================"
fi

echo ""
log "============================================"
log " Deployment complete!"
log " Site: http${SSL_AVAILABLE:+s}://$DOMAIN"
log "============================================"
echo ""
log "Useful commands:"
echo "  pm2 logs $APP_NAME      — view app logs"
echo "  pm2 restart $APP_NAME   — restart app"
echo "  nginx -t                — test nginx config"
echo "  journalctl -u nginx -f  — view nginx logs"
echo ""
