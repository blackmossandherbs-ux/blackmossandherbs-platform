# ============================================
# BLACK MOSS & HERBS - PRODUCTION DOCKERFILE
# Enterprise-grade multi-stage build
# ============================================

# ============================================
# Dependencies stage
# ============================================
FROM node:18-alpine AS deps
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    openssl \
    libc6-compat

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --only=production --legacy-peer-deps && \
    npm cache clean --force

# ============================================
# Builder stage
# ============================================
FROM node:18-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl libc6-compat

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application with optimizations
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Install runtime dependencies only
RUN apk add --no-cache \
    openssl \
    curl \
    tini && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy production dependencies
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy Prisma runtime
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start application
CMD ["node", "server.js"]
