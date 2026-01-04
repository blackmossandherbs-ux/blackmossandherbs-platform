#!/bin/bash

# Server Diagnostic Script for Black Moss & Herbs
# Run this to see what's actually running on your server

SERVER_IP="213.199.45.126"
SERVER_USER="root"

echo "🔍 BLACK MOSS & HERBS - SERVER DIAGNOSTICS"
echo "=========================================="
echo ""
echo "Server: $SERVER_IP"
echo "Domain: blackmossandherbs.com"
echo ""

echo "1️⃣  DNS Check"
echo "─────────────"
echo -n "blackmossandherbs.com resolves to: "
dig +short blackmossandherbs.com
echo ""

echo "2️⃣  Server Connectivity"
echo "─────────────────────"
if ping -c 1 -W 2 $SERVER_IP > /dev/null 2>&1; then
    echo "✅ Server is reachable"
else
    echo "❌ Server is not responding to ping"
fi
echo ""

echo "3️⃣  HTTP Response Check"
echo "──────────────────────"
echo "Testing HTTP on port 80..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 http://$SERVER_IP 2>/dev/null || echo "TIMEOUT")
echo "HTTP Status Code: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Server is responding with HTTP 200"
else
    echo "⚠️  Unexpected response code"
fi
echo ""

echo "4️⃣  Website Content Check"
echo "────────────────────────"
echo "What website is being served?"
TITLE=$(curl -s http://blackmossandherbs.com 2>/dev/null | grep -o '<title>[^<]*</title>' | sed 's/<title>//;s/<\/title>//' | head -1)
if [ -n "$TITLE" ]; then
    echo "Page Title: $TITLE"
    if echo "$TITLE" | grep -iq "hectic\|danny"; then
        echo "❌ WRONG SITE - Showing Hectic Radio!"
    elif echo "$TITLE" | grep -iq "black\|moss\|herb"; then
        echo "✅ CORRECT - Black Moss & Herbs is showing!"
    else
        echo "⚠️  Unknown site - Title: $TITLE"
    fi
else
    echo "⚠️  Could not determine page title"
fi
echo ""

echo "5️⃣  Port Scan"
echo "────────────"
echo "Checking common ports..."
for port in 22 80 443 3000 3005; do
    timeout 2 bash -c "</dev/tcp/$SERVER_IP/$port" 2>/dev/null && echo "✅ Port $port: OPEN" || echo "❌ Port $port: CLOSED"
done
echo ""

echo "6️⃣  Domain Response"
echo "──────────────────"
echo "Testing blackmossandherbs.com..."
DOMAIN_RESPONSE=$(curl -s http://blackmossandherbs.com 2>/dev/null | head -c 500)
if echo "$DOMAIN_RESPONSE" | grep -iq "hectic"; then
    echo "❌ Domain is serving HECTIC RADIO"
    echo ""
    echo "🔧 DIAGNOSIS: Nginx is configured to serve the wrong project"
elif echo "$DOMAIN_RESPONSE" | grep -iq "black.*moss\|moss.*herb"; then
    echo "✅ Domain is serving BLACK MOSS & HERBS"
    echo ""
    echo "🎉 Everything looks good!"
else
    echo "⚠️  Unclear what site is being served"
    echo ""
    echo "First 500 characters of response:"
    echo "$DOMAIN_RESPONSE"
fi
echo ""

echo "7️⃣  SSH Access Test"
echo "──────────────────"
if ssh -o ConnectTimeout=5 -o BatchMode=yes -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'SSH OK'" 2>/dev/null; then
    echo "✅ SSH access is working"
    echo ""
    echo "🔍 Checking server configuration..."
    echo ""
    
    ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'SSHEOF'
        echo "──────────────────────────────────────"
        echo "📦 Docker Containers:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Docker not available or no containers running"
        
        echo ""
        echo "──────────────────────────────────────"
        echo "🔧 PM2 Processes:"
        pm2 list 2>/dev/null || echo "PM2 not available or no processes"
        
        echo ""
        echo "──────────────────────────────────────"
        echo "🌐 Nginx Configuration:"
        echo "Enabled sites:"
        ls -1 /etc/nginx/sites-enabled/ 2>/dev/null || echo "Cannot read nginx config"
        
        echo ""
        echo "Active configuration:"
        cat /etc/nginx/sites-enabled/* 2>/dev/null | grep "server_name\|proxy_pass" | head -20 || echo "Cannot read nginx config"
        
        echo ""
        echo "──────────────────────────────────────"
        echo "📂 Deployed Projects:"
        ls -1 /var/www/ 2>/dev/null || echo "Cannot read /var/www"
        
        echo ""
        echo "──────────────────────────────────────"
        echo "🔍 What's on Port 3005:"
        curl -s -I http://localhost:3005 2>/dev/null | head -5 || echo "Port 3005 not responding"
        
        echo ""
        echo "──────────────────────────────────────"
        echo "🔍 What's on Port 80 (locally):"
        curl -s http://localhost 2>/dev/null | grep -i "title\|h1" | head -3 || echo "Port 80 not responding"
SSHEOF
    
else
    echo "❌ Cannot SSH into server"
    echo ""
    echo "You need to set up SSH key access:"
    echo "  1. Generate key (if needed): ssh-keygen -t ed25519"
    echo "  2. Copy to server: ssh-copy-id root@$SERVER_IP"
    echo "  3. Or add your public key to: /root/.ssh/authorized_keys on the server"
fi
echo ""

echo "════════════════════════════════════════"
echo "📊 SUMMARY"
echo "════════════════════════════════════════"
echo ""

if [ "$HTTP_CODE" = "200" ] && echo "$TITLE" | grep -iq "hectic"; then
    echo "🔴 PROBLEM CONFIRMED:"
    echo "   - Server is online and responding"
    echo "   - But serving WRONG website (Hectic Radio)"
    echo ""
    echo "🔧 SOLUTION:"
    echo "   Run: ./fix-deployment.sh"
    echo "   Or read: DEPLOYMENT_FIX_README.md"
elif [ "$HTTP_CODE" = "200" ] && echo "$TITLE" | grep -iq "black.*moss"; then
    echo "🟢 ALL GOOD:"
    echo "   - Server is online"
    echo "   - Correct website is being served"
    echo "   - Black Moss & Herbs is live!"
else
    echo "🟡 STATUS UNCLEAR:"
    echo "   - Server HTTP code: $HTTP_CODE"
    echo "   - Page title: $TITLE"
    echo ""
    echo "   Need to investigate further with SSH access"
fi
echo ""
