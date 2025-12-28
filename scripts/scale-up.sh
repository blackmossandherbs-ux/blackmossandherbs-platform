#!/bin/bash
set -e

echo "🚀 Scaling up BlackMoss & Herbs platform..."

# Check if scale compose file exists
if [ ! -f docker-compose.scale.yml ]; then
    echo "❌ docker-compose.scale.yml not found"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your configuration."
fi

# Start scaled services
echo "📦 Starting scaled services..."
docker-compose -f docker-compose.scale.yml up -d --build

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check health
echo "🏥 Checking service health..."
docker-compose -f docker-compose.scale.yml ps

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.scale.yml exec -T web-1 pnpm --filter @blackmoss/db db:migrate deploy

echo "✅ Scaled environment is running!"
echo ""
echo "🌐 Services:"
echo "  - Web App (Load Balanced): http://localhost:3000"
echo "  - Prometheus: http://localhost:9090"
echo "  - Grafana: http://localhost:3001"
echo "  - Health Check: http://localhost:8080/health"
echo ""
echo "📊 Monitor with:"
echo "  docker-compose -f docker-compose.scale.yml logs -f"
