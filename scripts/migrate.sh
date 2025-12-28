#!/bin/bash
set -e

echo "🗄️  Running database migrations..."

# Check if we're in docker or local
if docker-compose ps | grep -q "web.*Up"; then
    echo "Running migrations in Docker..."
    docker-compose exec web pnpm --filter @blackmoss/db db:migrate deploy
else
    echo "Running migrations locally..."
    pnpm --filter @blackmoss/db db:migrate deploy
fi

echo "✅ Migrations completed!"
