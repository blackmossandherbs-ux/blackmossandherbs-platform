# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Best Practices

### Environment Variables
- Never commit `.env` files
- Use strong, unique secrets for `NEXTAUTH_SECRET`
- Rotate Stripe keys regularly
- Use different keys for development and production

### Database Security
- Use strong database passwords
- Limit database access to application server only
- Regular backups with encryption
- Use connection pooling

### API Security
- All API routes validate authentication
- Webhook endpoints verify Stripe signatures
- Rate limiting on sensitive endpoints
- Input validation on all user inputs

### Authentication
- Secure cookie settings (httpOnly, secure, sameSite)
- JWT tokens with expiration
- Password hashing with bcrypt
- Role-based access control (RBAC)

### Deployment Security
- Non-root user in Docker containers
- Firewall rules (only necessary ports open)
- SSL/TLS certificates (Let's Encrypt)
- Security headers configured in Next.js

## Reporting a Vulnerability

If you discover a security vulnerability, please email security@blackmossandherbs.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours.

## Security Checklist

- [x] Environment variables not committed
- [x] Secrets properly managed
- [x] Database credentials secure
- [x] API authentication implemented
- [x] Webhook signature verification
- [x] Input validation
- [x] SQL injection prevention (Prisma)
- [x] XSS protection (React)
- [x] CSRF protection (NextAuth)
- [x] Security headers configured
- [x] HTTPS enforced
- [x] Error messages don't leak sensitive info
