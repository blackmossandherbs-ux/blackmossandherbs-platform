# Configuration Guide - Scaling Setup

This guide walks you through configuring all scaling components.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Cloudflare account (for CDN)
- Kubernetes cluster (optional, for auto-scaling)
- Basic understanding of load balancing

## 🚀 Quick Setup

```bash
# 1. Copy scaling configuration template
cp .env.scale.example .env.scale

# 2. Edit .env.scale with your settings
nano .env.scale

# 3. Run configuration script
./scripts/configure-scaling.sh
```

## 🌐 CDN Configuration (Cloudflare)

### Step 1: Get Cloudflare Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain
3. Get Zone ID from Overview (right sidebar)
4. Create API Token:
   - Go to Profile > API Tokens
   - Create token with Zone permissions

### Step 2: Configure

```bash
# Set environment variables
export CLOUDFLARE_API_TOKEN='your-token'
export CLOUDFLARE_ZONE_ID='your-zone-id'
export CLOUDFLARE_ZONE_NAME='blackmossandherbs.com'

# Run setup script
./config/cloudflare-setup.sh
```

### Step 3: Verify

- Check Cloudflare Dashboard for page rules
- Test CDN caching: `curl -I https://yourdomain.com/_next/static/...`
- Verify SSL/TLS is enabled

## 🗄️ Database Read Replicas

### Step 1: Start Primary Database

```bash
docker-compose up -d postgres
```

### Step 2: Setup Replicas

```bash
./scripts/setup-read-replicas.sh
```

### Step 3: Configure Application

Update `.env.scale`:
```bash
DATABASE_REPLICA_URL=postgresql://postgres:postgres@pgbouncer-replica:6432/blackmoss_herbs
```

Use in code:
```typescript
import { readFromReplica } from "@/lib/db-replica";

// For read queries
const products = await readFromReplica((prisma) =>
  prisma.product.findMany({ where: { status: "ACTIVE" } })
);
```

## 📈 Auto-scaling (Kubernetes)

### Step 1: Build Images

```bash
# Build and push to registry
docker build -t your-registry/blackmoss-web:latest -f Dockerfile .
docker build -t your-registry/blackmoss-worker:latest -f Dockerfile.worker .
docker push your-registry/blackmoss-web:latest
docker push your-registry/blackmoss-worker:latest
```

### Step 2: Create Secrets

```bash
kubectl create namespace blackmoss-production
kubectl create secret generic blackmoss-secrets \
  --from-literal=database-url='postgresql://...' \
  --from-literal=redis-url='redis://...' \
  --from-literal=nextauth-secret='your-secret' \
  -n blackmoss-production
```

### Step 3: Deploy

```bash
# Update image names in kubernetes/deployment.yml
kubectl apply -f kubernetes/deployment.yml
kubectl apply -f kubernetes/ingress.yml
kubectl apply -f kubernetes/queue-worker.yml
```

### Step 4: Verify

```bash
kubectl get pods -n blackmoss-production
kubectl get hpa -n blackmoss-production
kubectl describe hpa blackmoss-web-hpa -n blackmoss-production
```

## 📊 Monitoring Setup

### Step 1: Start Monitoring Stack

```bash
docker-compose -f docker-compose.scale.yml up -d prometheus grafana loki promtail
```

### Step 2: Access Dashboards

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001
  - Default login: `admin` / `admin` (change on first login)

### Step 3: Import Dashboards

1. Go to Grafana > Dashboards > Import
2. Import `monitoring/grafana/dashboards/dashboard.json`
3. Configure data sources (already configured)

### Step 4: Set Up Alerts

Alerts are pre-configured in `monitoring/alerts.yml`. To enable:

1. Install Alertmanager
2. Configure notification channels (email, Slack, etc.)
3. Update `monitoring/prometheus.yml` with Alertmanager URL

## 🔄 Background Jobs

### Step 1: Start Queue Workers

```bash
docker-compose -f docker-compose.scale.yml up -d queue-worker
```

### Step 2: Add Jobs in Code

```typescript
import { emailQueue } from "@blackmoss/queue";

await emailQueue.add("send-email", {
  to: "user@example.com",
  subject: "Welcome",
  html: "<h1>Welcome!</h1>",
});
```

### Step 3: Monitor Queue

- Check Grafana dashboard for queue metrics
- View queue in Redis: `redis-cli KEYS bullmq:*`

## 🔐 Security Configuration

### WAF Rules (Cloudflare)

1. Go to Cloudflare Dashboard > Security > WAF
2. Create custom rules:
   - Block SQL injection patterns
   - Block XSS attempts
   - Rate limit API endpoints

### Firewall Rules

Configure in Cloudflare Dashboard > Security > Firewall Rules:
- Block suspicious countries
- Challenge high-risk requests
- Allow only specific IPs for admin

### SSL/TLS

Already configured by Cloudflare setup script:
- SSL mode: Full (Strict)
- Always Use HTTPS: Enabled
- HTTP/2: Enabled
- HTTP/3: Enabled

## 📝 Environment Variables Reference

See `.env.scale.example` for all available options:

- `INSTANCE_ID` - Instance identifier
- `DATABASE_REPLICA_URL` - Read replica connection
- `REDIS_SESSION_URL` - Session storage
- `REDIS_QUEUE_URL` - Queue storage
- `CDN_ENABLED` - Enable CDN
- `AUTO_SCALE_ENABLED` - Enable auto-scaling
- `PROMETHEUS_ENABLED` - Enable monitoring

## 🧪 Testing Scaling

### Load Test

```bash
# Install Apache Bench
apt-get install apache2-utils

# Run load test
ab -n 10000 -c 100 http://localhost:3000/api/health

# Monitor with Grafana
```

### Health Check

```bash
# Check all instances
curl http://localhost:3000/api/health
curl http://localhost:8080/health

# Check load balancer
curl -H "Host: yourdomain.com" http://localhost/health
```

## 🐛 Troubleshooting

### CDN Not Caching

- Check Cloudflare page rules
- Verify cache headers
- Check cache status in Cloudflare dashboard

### Read Replicas Not Syncing

```bash
# Check replication status
docker-compose exec postgres-replica-1 psql -U postgres -c "SELECT pg_is_in_recovery();"

# Check replication lag
docker-compose exec postgres-replica-1 psql -U postgres -c "SELECT pg_last_wal_replay_lsn();"
```

### Auto-scaling Not Working

```bash
# Check HPA status
kubectl describe hpa blackmoss-web-hpa -n blackmoss-production

# Check metrics
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/namespaces/blackmoss-production/pods"
```

### Monitoring Not Showing Data

- Check Prometheus targets: http://localhost:9090/targets
- Verify exporters are running
- Check Grafana data source configuration

## 📚 Additional Resources

- [Cloudflare API Docs](https://developers.cloudflare.com/api/)
- [Kubernetes HPA Docs](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Docs](https://grafana.com/docs/)

---

**Need Help?** Check `docs/SCALING.md` for detailed information.
