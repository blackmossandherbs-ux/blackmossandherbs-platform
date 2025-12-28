#!/bin/bash
set -e

echo "🛑 Stopping BlackMoss & Herbs production environment..."

docker-compose down

echo "✅ All services stopped."
