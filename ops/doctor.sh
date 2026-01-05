#!/usr/bin/env bash
#
# ops/doctor.sh — basic production diagnostics (run ON the server)
#
# Usage:
#   sudo bash ops/doctor.sh
#
set -euo pipefail

section() {
  echo ""
  echo "============================================================"
  echo "$1"
  echo "============================================================"
}

cmd() {
  echo ""
  echo "+ $*"
  "$@" || true
}

section "System"
cmd uname -a
cmd date
cmd uptime

section "Networking / listeners"
cmd ss -lntp

section "Nginx"
cmd nginx -v
cmd nginx -t
cmd systemctl status nginx --no-pager
cmd ls -la /etc/nginx/sites-enabled
cmd ls -la /etc/nginx/sites-available

section "TLS certs (Let's Encrypt)"
cmd ls -la /etc/letsencrypt/live
cmd certbot certificates

section "Application checks (local curl)"
cmd curl -sS -I http://127.0.0.1:3000
cmd curl -sS -I http://127.0.0.1:3005
cmd curl -sS -I http://127.0.0.1
cmd curl -sS -I https://127.0.0.1 || true

section "Docker (if used)"
if command -v docker >/dev/null 2>&1; then
  cmd docker ps
  if command -v docker-compose >/dev/null 2>&1; then
    cmd docker-compose ps
    cmd docker-compose logs --tail=200
  fi
else
  echo "Docker not installed."
fi

section "PM2 (if used)"
if command -v pm2 >/dev/null 2>&1; then
  cmd pm2 status
  cmd pm2 logs --lines 200
else
  echo "PM2 not installed."
fi

section "Firewall"
cmd ufw status verbose

echo ""
echo "Done. If the domain is still down, the usual culprits are:"
echo " - DNS A/AAAA records not pointing to this server"
echo " - Nginx proxy_pass points to the wrong port (3000 vs 3005)"
echo " - Certbot/SSL not installed for the domain (HTTPS fails)"
echo " - Another site has the same server_name and is winning routing"
