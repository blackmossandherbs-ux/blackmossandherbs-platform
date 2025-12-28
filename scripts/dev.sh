#!/bin/bash
set -e

echo "🚀 Starting BlackMoss & Herbs development environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your configuration."
fi

# Start services with docker-compose
echo "📦 Starting Docker services (Postgres, Redis, Meilisearch, Ollama)..."
docker-compose up -d postgres redis meilisearch ollama

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if Postgres is ready
until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo "Waiting for Postgres..."
    sleep 2
done

echo "✅ Services are ready!"

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm --filter @blackmoss/db db:generate

# Run migrations
echo "🗄️  Running database migrations..."
pnpm --filter @blackmoss/db db:migrate

# Seed database (optional)
read -p "Do you want to seed the database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    pnpm --filter @blackmoss/db db:seed
fi

# Start dev server
echo "🎉 Starting development server..."
pnpm dev
