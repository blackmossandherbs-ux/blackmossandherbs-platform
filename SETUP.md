# Setup Instructions

## Quick Start (5 minutes)

### 1. Prerequisites Check

```bash
# Check Node.js version (requires 18+)
node --version

# Check pnpm (install if needed: npm install -g pnpm@8.15.0)
pnpm --version

# Check Docker
docker --version
docker-compose --version
```

### 2. Initial Setup

```bash
# Clone repository
git clone <your-repo-url>
cd blackmoss-and-herbs

# Copy environment file
cp .env.example .env

# Edit .env with your settings (minimum required):
# - DATABASE_URL (default works for Docker)
# - NEXTAUTH_SECRET (generate random string)
# - NEXTAUTH_URL (http://localhost:3000 for dev)
```

### 3. Start Development Environment

```bash
# Make scripts executable (if needed)
chmod +x scripts/*.sh

# Start everything
./scripts/dev.sh
```

The script will:
- Start Docker services (Postgres, Redis, Meilisearch, Ollama)
- Install all dependencies
- Generate Prisma client
- Run database migrations
- Optionally seed the database
- Start Next.js dev server

### 4. Access the Application

- **Web App**: http://localhost:3000
- **Prisma Studio**: Run `pnpm --filter @blackmoss/db db:studio`
- **Meilisearch**: http://localhost:7700
- **Ollama**: http://localhost:11434

### 5. Default Admin Login

After seeding:
- **Email**: `admin@blackmossandherbs.com`
- **Password**: `ChangeThis123!`

**⚠️ Change this immediately in production!**

## Manual Setup (Alternative)

If you prefer to set up manually:

```bash
# 1. Install dependencies
pnpm install

# 2. Start Docker services
docker-compose up -d postgres redis meilisearch ollama

# 3. Wait for services (10-15 seconds)
sleep 10

# 4. Generate Prisma client
pnpm --filter @blackmoss/db db:generate

# 5. Copy schema to web app (for Prisma CLI)
cp packages/db/prisma/schema.prisma apps/web/prisma/schema.prisma

# 6. Run migrations
pnpm --filter @blackmoss/db db:migrate

# 7. Seed database (optional)
pnpm --filter @blackmoss/db db:seed

# 8. Start dev server
pnpm dev
```

## Troubleshooting

### Port Already in Use

If ports are already in use, edit `docker-compose.yml` to change port mappings:

```yaml
ports:
  - "5433:5432"  # Change 5432 to 5433
```

### Database Connection Errors

```bash
# Check Postgres is running
docker-compose ps postgres

# Check connection
docker-compose exec postgres pg_isready -U postgres

# View logs
docker-compose logs postgres
```

### Prisma Client Not Found

```bash
# Regenerate Prisma client
pnpm --filter @blackmoss/db db:generate

# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Permission Denied on Scripts

```bash
chmod +x scripts/*.sh
```

## Next Steps

1. **Configure Stripe**: Add your Stripe keys to `.env`
2. **Set up Storage**: Configure R2 or S3 in `.env`
3. **Configure Email**: Add Resend API key
4. **Set up AI**: Configure Ollama or other providers
5. **Review Security**: See `docs/SECURITY.md`

## Development Commands

```bash
# Start dev server
pnpm dev

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Format code
pnpm format

# Database operations
pnpm --filter @blackmoss/db db:studio  # Open Prisma Studio
pnpm --filter @blackmoss/db db:migrate  # Run migrations
pnpm --filter @blackmoss/db db:seed    # Seed database

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
blackmoss-and-herbs/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── db/               # Database (Prisma)
│   ├── ui/               # UI components
│   └── utils/            # Utilities
├── scripts/              # Deployment scripts
├── docker-compose.yml    # Docker services
└── docs/                 # Documentation
```

## Getting Help

- Check `README.md` for overview
- See `docs/DEPLOYMENT.md` for production setup
- Review `docs/SECURITY.md` for security checklist
- Open an issue for bugs or questions
