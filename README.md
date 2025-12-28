# BlackMoss & Herbs - Premium Herbal Wellness Platform

A global, enterprise-grade herbal wellness platform built with Next.js 14, TypeScript, and modern web technologies. This platform includes eCommerce, subscriptions, digital products, consultations, content management, and an AI concierge system.

## 🚀 Features

### Core Modules
- **Shop**: Physical and digital products with variants, bundles, and cross-selling
- **Subscriptions**: Subscribe & save with customer self-serve portal
- **Digital Library**: PDF/EPUB/MP3 downloads with expiring links and watermarking
- **Blog/News**: SEO-optimized content management with RSS and sitemap
- **Video Hub**: Free and member-only videos with transcripts and chapters
- **Consultations**: Global booking system with timezone handling
- **Membership Portal**: Orders, downloads, video access, loyalty points
- **Admin Dashboard**: Comprehensive management and analytics

### AI System
- **Multi-Provider AI Orchestrator**: Routes to cheapest/free models (Ollama, Gemini, Claude, OpenAI)
- **Mr Herbs & Moss Concierge**: AI assistant for product recommendations and support
- **Semantic Caching**: Reduces API costs by caching similar queries
- **Safety Layer**: No medical claims, proper disclaimers, red flag detection

### Security
- **RBAC**: Role-based access control (Admin, Staff, Practitioner, Customer)
- **2FA**: Two-factor authentication for admin accounts
- **Rate Limiting**: API and general request rate limiting
- **Audit Logs**: Complete audit trail for all admin actions
- **Encrypted Storage**: Sensitive data encrypted at rest
- **Signed URLs**: Secure, expiring download links

## 🛠️ Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis (Upstash free tier supported)
- **Storage**: Cloudflare R2 or AWS S3
- **Search**: Meilisearch (self-hosted)
- **Payments**: Stripe
- **Email**: Resend
- **Observability**: Sentry
- **Deployment**: Docker + docker-compose + Nginx

## 📋 Prerequisites

- Node.js 18+ and pnpm 8+
- Docker and Docker Compose
- PostgreSQL 16+ (or use Docker)
- Redis (or use Docker)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd blackmoss-and-herbs

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. Development Setup

```bash
# Start development environment (includes DB, Redis, Meilisearch, Ollama)
./scripts/dev.sh
```

This script will:
- Start Docker services (Postgres, Redis, Meilisearch, Ollama)
- Install dependencies
- Generate Prisma client
- Run database migrations
- Optionally seed the database
- Start the Next.js dev server

### 3. Manual Setup (without scripts)

```bash
# Install dependencies
pnpm install

# Start Docker services
docker-compose up -d postgres redis meilisearch ollama

# Generate Prisma client
pnpm --filter @blackmoss/db db:generate

# Run migrations
pnpm --filter @blackmoss/db db:migrate

# Seed database (optional)
pnpm --filter @blackmoss/db db:seed

# Start dev server
pnpm dev
```

## 🐳 Production Deployment

### Using Docker Compose

```bash
# Build and start all services
./scripts/prod-up.sh

# Stop all services
./scripts/prod-down.sh
```

### Manual Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📝 Environment Variables

See `.env.example` for all required environment variables. Key variables:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `R2_*` or `AWS_*`: Storage configuration
- `RESEND_API_KEY`: Email service API key
- `MEILISEARCH_HOST`: Meilisearch host URL
- `MEILISEARCH_MASTER_KEY`: Meilisearch master key

## 🗄️ Database Management

```bash
# Run migrations
./scripts/migrate.sh

# Create backup
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh backups/backup_20240101_120000.sql.gz

# Seed database
./scripts/seed.sh

# Open Prisma Studio (GUI)
pnpm --filter @blackmoss/db db:studio
```

## 🏗️ Project Structure

```
blackmoss-and-herbs/
├── apps/
│   └── web/                 # Next.js web application
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   ├── lib/         # Utilities and helpers
│       │   └── types/       # TypeScript types
│       └── prisma/          # Prisma schema (symlinked)
├── packages/
│   ├── db/                  # Shared database package
│   │   ├── prisma/
│   │   │   └── schema.prisma # Main Prisma schema
│   │   └── src/
│   ├── ui/                  # Shared UI components (shadcn/ui)
│   └── utils/               # Shared utilities
├── scripts/                 # Deployment and utility scripts
├── docker-compose.yml       # Docker services configuration
├── Dockerfile              # Web app Dockerfile
└── nginx/                  # Nginx configuration
```

## 🔐 Default Admin Credentials

After seeding, default admin credentials:
- **Email**: `admin@blackmossandherbs.com` (or from `ADMIN_EMAIL` env)
- **Password**: `ChangeThis123!` (or from `ADMIN_PASSWORD` env)

**⚠️ IMPORTANT**: Change these immediately in production!

## 🔒 Security Checklist

- [ ] Change default admin credentials
- [ ] Set strong `NEXTAUTH_SECRET` and `ENCRYPTION_KEY`
- [ ] Configure proper CORS settings
- [ ] Set up SSL/TLS certificates (Let's Encrypt recommended)
- [ ] Enable Cloudflare WAF (optional but recommended)
- [ ] Configure rate limiting in Nginx
- [ ] Set up regular database backups
- [ ] Enable 2FA for admin accounts
- [ ] Review and restrict API endpoints
- [ ] Set up monitoring and alerting (Sentry)
- [ ] Configure secure cookie settings
- [ ] Review environment variables for secrets

## 📊 Monitoring & Observability

- **Sentry**: Error tracking and performance monitoring
- **Structured Logs**: All logs are structured for easy parsing
- **Audit Logs**: All admin actions are logged
- **Health Checks**: Docker health checks for all services

## 🤖 AI Configuration

The platform supports multiple AI providers with automatic fallback:

1. **Ollama** (Default, Free): Local models for cost control
2. **Google Gemini**: Free tier available
3. **Anthropic Claude**: Free tier where possible
4. **OpenAI**: Requires API key (paid)

Configure in `.env`:
```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
AI_DAILY_TOKEN_LIMIT=1000000
```

## 🧪 Development

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Format code
pnpm format

# Clean build artifacts
pnpm clean
```

## 📚 Documentation

- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Security Checklist](./docs/SECURITY.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

[Your License Here]

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the code comments

## 🎯 Roadmap

### Phase 1 ✅ (Completed)
- [x] Repo scaffold
- [x] Auth + RBAC
- [x] DB schema
- [x] UI kit

### Phase 2 (In Progress)
- [ ] Shop + Stripe integration
- [ ] Orders + Downloads
- [ ] Digital library MVP

### Phase 3 (Planned)
- [ ] Blog/News + SEO
- [ ] Video Hub
- [ ] Consultations
- [ ] Membership portal

### Phase 4 (Planned)
- [ ] AI Orchestrator
- [ ] Mr Herbs & Moss concierge
- [ ] Admin cost controls

### Phase 5 (Planned)
- [ ] Security hardening
- [ ] Monitoring setup
- [ ] Backup automation
- [ ] CI/CD pipeline

---

Built with ❤️ for the wellness community
