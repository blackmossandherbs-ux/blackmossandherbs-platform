#!/bin/bash
set -e

echo "🚀 Starting BlackMoss & Herbs production environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it from .env.example"
    exit 1
fi

# Build and start all services
echo "📦 Building and starting all services..."
docker-compose up -d --build

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose exec web pnpm --filter @blackmoss/db db:migrate deploy

echo "✅ Production environment is running!"
echo "🌐 Web: http://localhost:3000"
echo "📊 Meilisearch: http://localhost:7700"
echo "🤖 Ollama: http://localhost:11434"
