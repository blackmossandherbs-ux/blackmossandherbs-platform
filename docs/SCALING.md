# Scaling Guide - BlackMoss & Herbs

This guide covers scaling the platform for high traffic, global distribution, and enterprise workloads.

## 🎯 Scaling Strategy

### Horizontal Scaling (Scale Out)
- Multiple web application instances behind load balancer
- Database read replicas for read-heavy workloads
- Redis cluster for session storage and caching
- CDN for static assets and media

### Vertical Scaling (Scale Up)
- Increase database resources (CPU, RAM, SSD)
- Increase Redis memory allocation
- Optimize application code and queries

## 📊 Architecture Overview

```
                    ┌─────────────┐
                    │   CDN       │ (Cloudflare)
                    │  (Static)   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Load        │
                    │ Balancer    │ (Nginx)
                    │ (Nginx)     │
                    └──┬───────┬──┘
                       │       │
            ┌──────────▼─┐  ┌─▼──────────┐
            │  Web App   │  │  Web App   │
            │ Instance 1 │  │ Instance 2 │
            └──────┬─────┘  └─────┬──────┘
                   │              │
        ┌──────────┼──────────────┼──────────┐
        │          │              │          │
    ┌───▼───┐  ┌──▼───┐      ┌──▼───┐  ┌──▼───┐
    │Redis  │  │Postgres│     │Queue │  │Search│
    │Cluster│  │Primary │     │Worker│  │(Meili)│
    └───────┘  └───┬───┘      └──────┘  └──────┘
                    │
            ┌───────▼───────┐
            │ Postgres      │
            │ Read Replicas │
            └───────────────┘
```

## 🚀 Implementation Steps

### 1. Load Balancing

**File**: `docker-compose.scale.yml`

```bash
# Start scaled environment
docker-compose -f docker-compose.scale.yml up -d
```

**Features**:
- Nginx load balancer with health checks
- Multiple web app instances (web-1, web-2)
- Least-connections load balancing
- Automatic failover

### 2. Database Scaling

#### Connection Pooling (PgBouncer)

PgBouncer is configured in `docker-compose.scale.yml`:
- Transaction pooling mode
- Max 1000 client connections
- Default pool size: 25
- Reserve pool: 5 connections

**Update DATABASE_URL**:
```
postgresql://postgres:pass@pgbouncer:6432/blackmoss_herbs?pgbouncer=true
```

#### Read Replicas

For read-heavy workloads, add read replicas:

```yaml
postgres-replica:
  image: postgres:16-alpine
  environment:
    POSTGRES_MASTER_SERVICE_HOST: postgres
  command: postgres -c hot_standby=on
```

**Prisma Configuration**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Read replica URL
  directUrl = env("DATABASE_DIRECT_URL")
}
```

### 3. Redis for Sessions

**Configuration**:
- Separate Redis instance for sessions (`REDIS_SESSION_URL`)
- Separate Redis instance for queue (`REDIS_QUEUE_URL`)
- Redis Sentinel for high availability

**Update NextAuth**:
```typescript
// Use Redis session store
import { authOptionsRedis } from "@/lib/auth-redis";
```

### 4. Background Job Queue

**Queue System**: BullMQ with Redis

**Jobs**:
- Email sending
- Image processing
- Webhook delivery
- Report generation

**Add Job**:
```typescript
import { emailQueue } from "@blackmoss/queue";

await emailQueue.add("send-email", {
  to: "user@example.com",
  subject: "Welcome",
  html: "<h1>Welcome!</h1>",
});
```

### 5. CDN Configuration

**Cloudflare Setup**:

1. Add your domain to Cloudflare
2. Configure DNS records
3. Enable caching rules:
   - Cache static assets: 1 year
   - Cache API responses: 5 minutes
   - Cache HTML: 2 hours

**Next.js Configuration**:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
  },
};
```

### 6. Monitoring & Observability

**Stack**:
- Prometheus: Metrics collection
- Grafana: Visualization
- Loki: Log aggregation
- Promtail: Log collection

**Access**:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001
- Loki: http://localhost:3100

**Key Metrics**:
- Request rate
- Response time (p50, p95, p99)
- Error rate
- Database connection pool usage
- Redis memory usage
- Queue backlog

### 7. Rate Limiting (Redis-based)

**Implementation**: `apps/web/src/lib/redis.ts`

```typescript
import { rateLimitRedis } from "@/lib/redis";

const result = await rateLimitRedis(
  `api:${userId}`,
  100, // limit
  60000 // window (ms)
);

if (!result.allowed) {
  return NextResponse.json(
    { error: "Rate limit exceeded" },
    { status: 429 }
  );
}
```

### 8. Caching Strategy

**Layers**:
1. **CDN**: Static assets, images (1 year)
2. **Redis**: API responses, sessions (varies)
3. **Application**: In-memory cache for hot data
4. **Database**: Query result cache

**Cache Invalidation**:
- Product updates → Invalidate product cache
- Order creation → Invalidate user cache
- Content updates → Invalidate content cache

## 📈 Performance Targets

### Response Times
- API endpoints: < 200ms (p95)
- Page loads: < 1s (First Contentful Paint)
- Database queries: < 50ms (p95)

### Throughput
- API requests: 1000+ req/s
- Page views: 500+ req/s
- Database queries: 5000+ qps

### Availability
- Uptime: 99.9% (8.76 hours downtime/year)
- Database: 99.95%
- Redis: 99.9%

## 🔧 Configuration Files

### Environment Variables

```bash
# Scaling-specific
INSTANCE_ID=web-1
REDIS_SESSION_URL=redis://redis:6379/1
REDIS_QUEUE_URL=redis://redis:6379/2
DATABASE_URL=postgresql://postgres:pass@pgbouncer:6432/db?pgbouncer=true
DATABASE_DIRECT_URL=postgresql://postgres:pass@postgres:5432/db

# CDN
CDN_URL=https://cdn.blackmossandherbs.com
CDN_ENABLED=true

# Monitoring
PROMETHEUS_ENABLED=true
GRAFANA_ENABLED=true
```

## 🚨 Scaling Checklist

### Immediate (0-10K users)
- [x] Load balancer configured
- [x] Multiple web instances
- [x] Redis for sessions
- [x] Connection pooling
- [x] Health checks
- [x] Basic monitoring

### Short-term (10K-100K users)
- [ ] Database read replicas
- [ ] CDN for static assets
- [ ] Redis cluster
- [ ] Queue workers (multiple)
- [ ] Advanced monitoring
- [ ] Auto-scaling rules

### Long-term (100K+ users)
- [ ] Multi-region deployment
- [ ] Database sharding
- [ ] Edge functions
- [ ] Advanced caching
- [ ] DDoS protection
- [ ] Global load balancing

## 📊 Monitoring Dashboards

### Grafana Dashboards

1. **Application Performance**
   - Request rate
   - Response time
   - Error rate
   - Active users

2. **Database Performance**
   - Connection pool usage
   - Query performance
   - Replication lag
   - Cache hit rate

3. **Infrastructure**
   - CPU/Memory usage
   - Network I/O
   - Disk I/O
   - Container health

## 🔄 Auto-scaling

### Kubernetes (Future)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Docker Swarm (Current)

```bash
docker service scale web-app=5
```

## 🌍 Multi-Region Deployment

### Strategy
1. Primary region: Full stack
2. Secondary regions: Read replicas + CDN
3. Edge locations: Static assets only

### Database Replication
- Primary: Write operations
- Replicas: Read operations
- Cross-region replication: 1-2 second lag

### Session Management
- Sticky sessions (session affinity)
- Or: Shared Redis cluster across regions

## 💰 Cost Optimization

### Compute
- Use spot instances for workers
- Right-size instances based on metrics
- Auto-scale down during low traffic

### Database
- Use read replicas for analytics
- Archive old data
- Optimize queries

### Storage
- Use CDN for static assets
- Compress images
- Use object storage (R2/S3)

### Caching
- Aggressive caching for static content
- Cache API responses where possible
- Use Redis efficiently

## 🛠️ Troubleshooting

### High Database Connections
- Check connection pooling
- Review query patterns
- Add read replicas

### Slow Response Times
- Check database queries
- Review Redis performance
- Check CDN cache hit rate
- Review application code

### Memory Issues
- Check Redis memory usage
- Review application memory
- Check for memory leaks

## 📚 Additional Resources

- [Nginx Load Balancing](https://nginx.org/en/docs/http/load_balancing.html)
- [PgBouncer Documentation](https://www.pgbouncer.org/)
- [BullMQ Guide](https://docs.bullmq.io/)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/)

---

**Ready to scale!** Start with load balancing and monitoring, then add read replicas and CDN as traffic grows.
