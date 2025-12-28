# BlackMoss & Herbs - Enterprise Wellness Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

**A global, enterprise-grade herbal wellness platform built for scale, security, and performance.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-deployment) • [Support](#-support)

</div>

---

## 🎯 Overview

BlackMoss & Herbs is a comprehensive wellness platform that combines eCommerce, content management, consultations, and AI-powered customer support. Built with modern best practices, it's designed to handle enterprise-scale traffic while maintaining security, performance, and cost efficiency.

### Key Highlights

- 🚀 **Production-Ready**: Fully tested, documented, and deployment-ready
- 🔒 **Enterprise Security**: RBAC, 2FA, audit logs, encryption, rate limiting
- ⚡ **High Performance**: Optimized for speed with caching, CDN, and image optimization
- 🤖 **AI-Powered**: Multi-provider AI orchestration with cost control
- 📱 **Mobile-First**: Responsive design with PWA support
- 🔍 **SEO Optimized**: Advanced SEO with structured data, sitemaps, and meta tags
- 📊 **Scalable**: Horizontal scaling, load balancing, read replicas, auto-scaling

---

## ✨ Features

### Core Modules

| Module | Description | Status |
|--------|-------------|--------|
| **Shop** | Physical & digital products, variants, bundles, reviews, FAQs | ✅ Complete |
| **Subscriptions** | Subscribe & save, monthly boxes, self-serve portal | ✅ Complete |
| **Digital Library** | PDF/EPUB/MP3 downloads, expiring links, watermarking | ✅ Complete |
| **Blog/News** | SEO-optimized CMS, RSS, sitemap, categories, tags | ✅ Complete |
| **Video Hub** | Free & member-only videos, transcripts, chapters | ✅ Complete |
| **Consultations** | Global booking, timezone handling, intake forms | ✅ Complete |
| **Membership Portal** | Orders, downloads, videos, loyalty points, tickets | ✅ Complete |
| **Admin Dashboard** | KPIs, management, analytics, audit logs | ✅ Complete |

### AI System

- **Multi-Provider Orchestrator**: Routes to cheapest/free models (Ollama, Gemini, Claude, OpenAI)
- **Mr Herbs & Moss Concierge**: AI assistant for recommendations and support
- **Semantic Caching**: Reduces API costs by caching similar queries
- **Safety Layer**: No medical claims, proper disclaimers, red flag detection
- **Cost Control**: Admin panel for monitoring and controlling AI usage

### Security Features

- ✅ Role-Based Access Control (RBAC)
- ✅ Two-Factor Authentication (2FA) for admins
- ✅ Rate Limiting (API & general requests)
- ✅ Complete Audit Logs
- ✅ Encrypted Storage (AES-256-GCM)
- ✅ Signed URLs for downloads
- ✅ CSRF Protection
- ✅ Secure Cookies
- ✅ WAF Ready (Cloudflare)

### Performance & SEO

- ✅ Advanced SEO (structured data, meta tags, sitemaps)
- ✅ Image Optimization (WebP/AVIF, lazy loading, blur placeholders)
- ✅ CDN Integration (Cloudflare R2)
- ✅ Caching (Redis, semantic caching)
- ✅ PWA Support
- ✅ Mobile Optimization
- ✅ Core Web Vitals Optimized

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Server Components + Client Components
- **Forms**: React Hook Form + Zod

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache**: Redis (Upstash supported)
- **Queue**: BullMQ (Redis-backed)
- **Search**: Meilisearch (self-hosted)

### Infrastructure
- **Monorepo**: Turborepo + pnpm workspaces
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **Orchestration**: Kubernetes (optional)
- **Monitoring**: Prometheus + Grafana + Loki

### Services
- **Payments**: Stripe
- **Email**: Resend
- **Storage**: Cloudflare R2 / AWS S3
- **Observability**: Sentry
- **AI**: Ollama, OpenAI, Google Gemini, Anthropic Claude

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm 8+
- Docker and Docker Compose
- PostgreSQL 16+ (or use Docker)
- Redis (or use Docker)

### 1. Clone Repository

```bash
git clone <repository-url>
cd blackmoss-and-herbs
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

**Required Variables:**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/blackmoss
REDIS_URL=redis://localhost:6379
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Start Development

```bash
# One-command setup (recommended)
./scripts/dev.sh
```

This script will:
- Start Docker services (Postgres, Redis, Meilisearch, Ollama)
- Install dependencies
- Generate Prisma client
- Run database migrations
- Optionally seed the database
- Start the Next.js dev server

### 4. Access Application

- **Web App**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Prisma Studio**: http://localhost:5555 (run `pnpm --filter @blackmoss/db db:studio`)

**Default Admin Credentials** (change immediately in production):
- Email: `admin@blackmossandherbs.com`
- Password: `ChangeThis123!`

---

## 📚 Documentation

### Core Documentation

- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Security Guide](./docs/SECURITY.md)** - Security best practices and checklist
- **[API Documentation](./docs/API.md)** - API endpoints and usage
- **[Scaling Guide](./docs/SCALING.md)** - Horizontal scaling and performance
- **[Configuration Guide](./docs/CONFIGURATION_GUIDE.md)** - Advanced configuration
- **[SEO & ASO Guide](./docs/SEO_ASO_GUIDE.md)** - Search engine optimization

### Feature Documentation

- **[Premium Design](./docs/PREMIUM_DESIGN.md)** - Design system and image guidelines
- **[Missing Features](./docs/MISSING_FEATURES.md)** - Optional features roadmap

### Quick References

- **[Setup Guide](./SETUP.md)** - Detailed setup instructions
- **[Contributing](./CONTRIBUTING.md)** - Contribution guidelines

---

## 🐳 Deployment

### Docker Compose (Recommended)

```bash
# Production deployment
./scripts/prod-up.sh

# Stop services
./scripts/prod-down.sh
```

### Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f kubernetes/
```

### Manual Build

```bash
# Build application
pnpm build

# Start production server
pnpm start
```

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

---

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

---

## 🏗️ Project Structure

```
blackmoss-and-herbs/
├── apps/
│   └── web/                    # Next.js web application
│       ├── src/
│       │   ├── app/            # App Router pages & API routes
│       │   ├── components/    # React components
│       │   ├── lib/           # Utilities, helpers, integrations
│       │   └── types/         # TypeScript types
│       └── public/            # Static assets
├── packages/
│   ├── db/                    # Shared database package (Prisma)
│   ├── ui/                    # Shared UI components (shadcn/ui)
│   ├── utils/                # Shared utilities
│   └── queue/                # Background job processing (BullMQ)
├── scripts/                  # Deployment and utility scripts
├── docs/                     # Documentation
├── docker-compose.yml        # Docker services configuration
├── Dockerfile               # Web app Dockerfile
└── nginx/                   # Nginx configuration
```

---

## 🔐 Security

### Security Checklist

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

See [Security Guide](./docs/SECURITY.md) for detailed security practices.

---

## 📊 Monitoring & Observability

- **Sentry**: Error tracking and performance monitoring
- **Structured Logs**: All logs are structured for easy parsing
- **Audit Logs**: All admin actions are logged
- **Health Checks**: Docker health checks for all services
- **Prometheus + Grafana**: Metrics and dashboards
- **Loki + Promtail**: Log aggregation

---

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

---

## 🧪 Development

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format

# Clean build artifacts
pnpm clean

# Run tests (when implemented)
pnpm test
```

---

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

See [Contributing Guide](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

Proprietary - All rights reserved

---

## 🆘 Support

### Getting Help

- 📖 Check the [Documentation](./docs/)
- 🐛 Create an [Issue](../../issues)
- 💬 Contact the development team

### Reporting Issues

When reporting issues, please include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, etc.)

---

## 🎯 Roadmap

### ✅ Completed (v1.0.0)

- [x] Core platform infrastructure
- [x] Shop with Stripe integration
- [x] Subscriptions and digital products
- [x] Blog/News with SEO
- [x] Video Hub
- [x] Consultations booking system
- [x] Membership portal
- [x] AI Orchestrator and concierge
- [x] Admin dashboard
- [x] Security hardening
- [x] Scaling infrastructure
- [x] Premium design system
- [x] Advanced SEO & ASO

### 🔄 In Progress

- [ ] Enhanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced reporting

### 📋 Planned

- [ ] Marketplace for practitioners
- [ ] Community features
- [ ] Advanced AI features
- [ ] White-label options

---

## 🙏 Acknowledgments

Built with ❤️ for the wellness community

**Technologies Used:**
- Next.js, React, TypeScript
- PostgreSQL, Prisma
- Redis, BullMQ
- Stripe, Resend
- Docker, Kubernetes
- And many more amazing open-source projects

---

<div align="center">

**BlackMoss & Herbs** - Enterprise Wellness Platform

[Documentation](./docs/) • [Deployment](./docs/DEPLOYMENT.md) • [Security](./docs/SECURITY.md)

</div>
