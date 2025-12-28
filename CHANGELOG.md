# Changelog

All notable changes to the BlackMoss & Herbs platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added

#### Core Platform
- Complete monorepo structure with Turborepo and pnpm workspaces
- Next.js 14 App Router application with TypeScript
- PostgreSQL database with Prisma ORM
- Authentication system with NextAuth.js
- Role-Based Access Control (RBAC) with Admin, Staff, Practitioner, and Customer roles
- Comprehensive database schema covering all platform features

#### E-Commerce
- Shop module with products, variants, bundles, and routines
- Stripe integration for payments and subscriptions
- Shopping cart functionality
- Order management system
- Digital product downloads with signed URLs
- Product reviews and FAQs
- Cross-selling and related products

#### Subscriptions
- Subscribe & save functionality
- Monthly ritual boxes with tiers
- Customer self-serve portal (pause, skip, swap, address/billing changes)
- Member pricing and early access

#### Content Management
- Blog/News module with SEO optimization
- Video Hub with free and member-only content
- Content categories, tags, and related articles
- RSS feed generation
- XML sitemap generation
- Image sitemap for products

#### Consultations
- Global booking system with timezone handling
- Practitioner management
- Intake forms and consent management
- Payment before booking
- Customer dashboard for appointments

#### Membership Portal
- Orders history
- Subscription management
- Digital library access
- Video access
- Saved routines
- Referrals and loyalty points
- Support tickets

#### Admin Dashboard
- Comprehensive KPIs dashboard
- Product management
- Order and refund management
- Subscription management
- Content management
- Consultation management
- User and role management
- Audit log system
- Feature flags
- Content scheduling
- Coupon engine

#### AI System
- Multi-provider AI Orchestrator (Ollama, OpenAI, Google Gemini, Anthropic Claude)
- "Mr Herbs & Moss" AI Concierge persona
- Semantic caching for cost reduction
- Safety layer with disclaimers and red flag detection
- Admin cost control panel
- Usage tracking and quotas

#### Security
- Two-factor authentication (2FA) for admins
- Rate limiting (API and general requests)
- Complete audit logging
- Encrypted storage (AES-256-GCM)
- Signed URLs for downloads
- CSRF protection
- Secure cookies
- CORS configuration
- Webhook verification (Stripe)
- Dependency scanning (Trivy)
- Security headers middleware

#### Performance & SEO
- Advanced SEO with structured data (Schema.org)
- Dynamic meta tags and Open Graph
- Breadcrumb navigation with schema
- Internal linking utilities
- Social sharing components
- Keyword extraction and optimization
- Image optimization (WebP/AVIF, lazy loading, blur placeholders)
- CDN integration (Cloudflare R2)
- Redis caching
- Semantic caching for AI

#### Design System
- Premium design theme with gradients and animations
- High-resolution image support
- Responsive design (mobile-first)
- PWA support with manifest
- Custom error pages (404, error boundary)
- Loading states and skeleton loaders
- Accessibility improvements (ARIA attributes)

#### Infrastructure & Deployment
- Docker and Docker Compose configuration
- Nginx reverse proxy configuration
- Kubernetes manifests (Deployment, Service, Ingress, HPA)
- Horizontal scaling support
- Load balancing configuration
- Database connection pooling (PgBouncer)
- Read replicas support
- Background job processing (BullMQ)
- Monitoring stack (Prometheus, Grafana, Loki, Promtail)
- CI/CD workflows (GitHub Actions)
- One-command deployment scripts

#### Documentation
- Comprehensive README
- Deployment guide
- Security guide
- API documentation
- Scaling guide
- Configuration guide
- SEO & ASO guide
- Premium design guide
- Contributing guidelines
- Code of conduct

### Security

- All sensitive data encrypted at rest
- Secure password hashing (bcrypt)
- JWT token-based sessions
- Rate limiting on all API endpoints
- Audit logs for all admin actions
- Secure file downloads with expiring URLs
- No PII in AI prompts

### Performance

- Optimized database queries with Prisma
- Redis caching for sessions and general cache
- Image optimization with Next.js Image component
- CDN support for static assets
- Lazy loading for images and components
- Semantic caching for AI responses

### Infrastructure

- Dockerized for easy deployment
- Kubernetes-ready manifests
- Horizontal scaling support
- Load balancing with Nginx
- Database read replicas
- Background job processing
- Comprehensive monitoring

---

## [Unreleased]

### Planned Features
- Enhanced analytics dashboard
- Mobile app (React Native)
- Multi-language support
- Advanced reporting
- Marketplace for practitioners
- Community features
- Advanced AI features
- White-label options

---

[1.0.0]: https://github.com/blackmoss/herbs-platform/releases/tag/v1.0.0
