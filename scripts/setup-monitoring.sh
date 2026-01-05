#!/bin/bash

# HECTIC Intellectual Property - Copyright 2024
# Black Moss & Herbs Platform - Monitoring Setup Script
# Enterprise monitoring configuration

set -euo pipefail

echo "📊 Black Moss & Herbs - Monitoring Setup"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/var/www/blackmossandherbs-platform"
DOMAIN="${1:-blackmossandherbs.com}"

# Create monitoring directory
MONITOR_DIR="/var/monitoring/blackmossandherbs"
mkdir -p "$MONITOR_DIR"

echo -e "${YELLOW}Setting up monitoring...${NC}"

# Create health check script
cat > "$MONITOR_DIR/health-check.sh" << 'EOF'
#!/bin/bash
# Health check script for monitoring tools

HEALTH_URL="http://localhost:3000/api/health"
READY_URL="http://localhost:3000/api/ready"

# Check health
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")
READY_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$READY_URL" || echo "000")

if [ "$HEALTH_RESPONSE" = "200" ] && [ "$READY_RESPONSE" = "200" ]; then
    echo "OK - Application is healthy"
    exit 0
else
    echo "CRITICAL - Application health check failed (Health: $HEALTH_RESPONSE, Ready: $READY_RESPONSE)"
    exit 2
fi
EOF

chmod +x "$MONITOR_DIR/health-check.sh"

# Create PM2 monitoring script
cat > "$MONITOR_DIR/pm2-status.sh" << 'EOF'
#!/bin/bash
# PM2 status check

if command -v pm2 &> /dev/null; then
    STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="blackmossandherbs") | .pm2_env.status')
    if [ "$STATUS" = "online" ]; then
        echo "OK - PM2 process is online"
        exit 0
    else
        echo "CRITICAL - PM2 process is not online (Status: $STATUS)"
        exit 2
    fi
else
    echo "WARNING - PM2 not found"
    exit 1
fi
EOF

chmod +x "$MONITOR_DIR/pm2-status.sh"

# Create database monitoring script
cat > "$MONITOR_DIR/db-check.sh" << 'EOF'
#!/bin/bash
# Database connectivity check

if [ -f "/var/www/blackmossandherbs-platform/.env" ]; then
    export PGPASSWORD=$(grep DATABASE_URL /var/www/blackmossandherbs-platform/.env | sed 's/.*:\/\/.*:\(.*\)@.*/\1/' | tr -d '"')
    DB_NAME=$(grep DATABASE_URL /var/www/blackmossandherbs-platform/.env | sed 's/.*\/\([^?]*\).*/\1/')
    
    if psql -h localhost -U dbuser -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
        echo "OK - Database is accessible"
        exit 0
    else
        echo "CRITICAL - Database connection failed"
        exit 2
    fi
else
    echo "WARNING - .env file not found"
    exit 1
fi
EOF

chmod +x "$MONITOR_DIR/db-check.sh"

# Create nginx monitoring script
cat > "$MONITOR_DIR/nginx-check.sh" << 'EOF'
#!/bin/bash
# Nginx status check

if systemctl is-active --quiet nginx; then
    echo "OK - Nginx is running"
    exit 0
else
    echo "CRITICAL - Nginx is not running"
    exit 2
fi
EOF

chmod +x "$MONITOR_DIR/nginx-check.sh"

# Create comprehensive monitoring script
cat > "$MONITOR_DIR/full-check.sh" << 'EOF'
#!/bin/bash
# Comprehensive system check

echo "=== Black Moss & Herbs - System Health Check ==="
echo ""

# Application health
echo "Application Health:"
curl -s http://localhost:3000/api/health | jq '.' || echo "Failed"
echo ""

# PM2 Status
echo "PM2 Status:"
pm2 status | grep blackmossandherbs || echo "Not found"
echo ""

# Database
echo "Database:"
if [ -f "/var/www/blackmossandherbs-platform/.env" ]; then
    export PGPASSWORD=$(grep DATABASE_URL /var/www/blackmossandherbs-platform/.env | sed 's/.*:\/\/.*:\(.*\)@.*/\1/' | tr -d '"')
    DB_NAME=$(grep DATABASE_URL /var/www/blackmossandherbs-platform/.env | sed 's/.*\/\([^?]*\).*/\1/')
    psql -h localhost -U dbuser -d "$DB_NAME" -c "SELECT version();" 2>/dev/null | head -1 || echo "Connection failed"
fi
echo ""

# Nginx
echo "Nginx:"
systemctl status nginx --no-pager | head -3
echo ""

# Disk Space
echo "Disk Space:"
df -h / | tail -1
echo ""

# Memory
echo "Memory:"
free -h | head -2
echo ""

echo "=== Check Complete ==="
EOF

chmod +x "$MONITOR_DIR/full-check.sh"

# Create cron job for automated monitoring
cat > "$MONITOR_DIR/setup-cron.sh" << EOF
#!/bin/bash
# Setup monitoring cron jobs

(crontab -l 2>/dev/null | grep -v "blackmossandherbs"; cat << 'CRONEOF'
# Black Moss & Herbs Monitoring
*/5 * * * * $MONITOR_DIR/health-check.sh >> /var/log/blackmoss-health.log 2>&1
0 * * * * $MONITOR_DIR/full-check.sh >> /var/log/blackmoss-full-check.log 2>&1
CRONEOF
) | crontab -

echo -e "${GREEN}✓ Monitoring cron jobs configured${NC}"
EOF

chmod +x "$MONITOR_DIR/setup-cron.sh"

echo -e "${GREEN}✓ Monitoring scripts created${NC}"
echo ""
echo "Monitoring scripts location: $MONITOR_DIR"
echo ""
echo -e "${YELLOW}To setup automated monitoring, run:${NC}"
echo "  $MONITOR_DIR/setup-cron.sh"
echo ""
echo -e "${YELLOW}To run manual health check:${NC}"
echo "  $MONITOR_DIR/full-check.sh"
echo ""
