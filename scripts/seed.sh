#!/bin/bash
set -e

echo "🌱 Seeding database..."

# Check if we're in docker or local
if docker-compose ps | grep -q "web.*Up"; then
    echo "Running seed in Docker..."
    docker-compose exec web pnpm --filter @blackmoss/db db:seed
else
    echo "Running seed locally..."
    pnpm --filter @blackmoss/db db:seed
fi

echo "✅ Database seeded successfully!"
