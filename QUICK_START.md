# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ and pnpm 8+
- Docker and Docker Compose
- Git

## 1. Clone & Setup (2 minutes)

```bash
# Clone repository
git clone <your-repo-url>
cd blackmoss-and-herbs

# Copy environment file
cp .env.example .env

# Edit .env (minimum required):
# - DATABASE_URL (default works for Docker)
# - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000 for dev)
```

## 2. Start Development (5 minutes)

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Start everything (Docker + App)
./scripts/dev.sh
```

This will:
- ✅ Start Docker services (Postgres, Redis, Meilisearch, Ollama)
- ✅ Install dependencies
- ✅ Generate Prisma client
- ✅ Run migrations
- ✅ Optionally seed database
- ✅ Start Next.js dev server

## 3. Access the Platform

- **Web App**: http://localhost:3000
- **Admin Login**: 
  - Email: `admin@blackmossandherbs.com`
  - Password: `ChangeThis123!`
- **Prisma Studio**: Run `pnpm --filter @blackmoss/db db:studio`
- **Meilisearch**: http://localhost:7700
- **Ollama**: http://localhost:11434

## 4. First Steps

1. **Change Admin Password** (IMPORTANT!)
   - Sign in as admin
   - Go to Account settings
   - Update password

2. **Add Products**
   - Use Prisma Studio: `pnpm --filter @blackmoss/db db:studio`
   - Or use admin panel (when implemented)

3. **Configure Stripe**
   - Add Stripe keys to `.env`
   - Set webhook URL: `https://yourdomain.com/api/stripe/webhook`

4. **Set up Storage**
   - Configure R2 or S3 in `.env`
   - Update `STORAGE_PROVIDER` variable

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Database
pnpm --filter @blackmoss/db db:generate  # Generate Prisma client
pnpm --filter @blackmoss/db db:migrate    # Run migrations
pnpm --filter @blackmoss/db db:studio    # Open Prisma Studio
pnpm --filter @blackmoss/db db:seed      # Seed database

# Scripts
./scripts/dev.sh            # Start development
./scripts/prod-up.sh        # Start production
./scripts/prod-down.sh      # Stop production
./scripts/backup.sh         # Backup database
./scripts/restore.sh <file> # Restore database
./scripts/migrate.sh        # Run migrations
./scripts/seed.sh           # Seed database

# Docker
docker-compose up -d        # Start services
docker-compose down         # Stop services
docker-compose logs -f      # View logs
docker-compose ps           # Check status
```

## Troubleshooting

### Port Already in Use
Edit `docker-compose.yml` to change port mappings.

### Database Connection Error
```bash
# Check Postgres is running
docker-compose ps postgres

# Check connection
docker-compose exec postgres pg_isready -U postgres
```

### Prisma Client Not Found
```bash
pnpm --filter @blackmoss/db db:generate
```

### Permission Denied on Scripts
```bash
chmod +x scripts/*.sh
```

## Next Steps

1. Read `README.md` for overview
2. Check `docs/DEPLOYMENT.md` for production setup
3. Review `docs/SECURITY.md` for security checklist
4. See `FINAL_SUMMARY.md` for complete feature list

## Need Help?

- Check documentation in `/docs`
- Review code comments
- Check GitHub Issues
- Review audit logs

---

**You're all set! 🎉**
