#!/bin/bash

# Black Moss & Herbs Platform - Quick Start Script
# This script helps you get started quickly

echo "🌿 Black Moss & Herbs Platform - Quick Start"
echo "============================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your credentials."
    echo ""
    echo "Required:"
    echo "  - DATABASE_URL (PostgreSQL connection string)"
    echo "  - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
    echo "  - STRIPE_SECRET_KEY (from Stripe dashboard)"
    echo "  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (from Stripe dashboard)"
    echo ""
    read -p "Press Enter after you've updated .env file..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Ask about database setup
echo ""
read -p "Have you set up your PostgreSQL database? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Pushing database schema..."
    npx prisma db push
    echo "✅ Database schema created!"
else
    echo "⚠️  Please set up your PostgreSQL database first."
    echo "   See DEPLOYMENT.md for database setup options."
    exit 1
fi

# Start development server
echo ""
echo "🚀 Starting development server..."
echo "   Your site will be available at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
