# API Documentation

## Base URL
- Production: `https://blackmossandherbs.com`
- Development: `http://localhost:3000`

## Authentication

Most endpoints require authentication via NextAuth session cookies.

### Admin Endpoints
Admin endpoints require `ADMIN` role in the user session.

## Endpoints

### Health & Monitoring

#### GET `/api/health`
Health check endpoint for monitoring tools.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "database": "connected"
}
```

**Status Codes:**
- `200` - Healthy
- `503` - Unhealthy

---

#### GET `/api/ready`
Readiness check with dependency validation.

**Response:**
```json
{
  "ready": true,
  "checks": {
    "database": true,
    "stripe": true,
    "nextauth": true
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - All dependencies ready
- `503` - Dependencies not ready

---

### Authentication

#### POST `/api/auth/signin`
Sign in endpoint (handled by NextAuth).

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

#### POST `/api/auth/signout`
Sign out endpoint (handled by NextAuth).

#### GET `/api/auth/session`
Get current session (handled by NextAuth).

---

### Webhooks

#### POST `/api/webhooks/stripe`
Stripe webhook endpoint for payment processing.

**Headers:**
- `Stripe-Signature` - Required for signature verification

**Supported Events:**
- `checkout.session.completed` - Payment completed
- `invoice.payment_succeeded` - Subscription renewed
- `customer.subscription.deleted` - Subscription cancelled

**Response:**
- `200` - Webhook processed successfully
- `400` - Invalid signature or missing data
- `500` - Processing error

---

## Rate Limiting

API endpoints are rate-limited:
- General endpoints: 100 requests per minute per IP
- API endpoints: 50 requests per minute per IP

Rate limit headers:
- `X-RateLimit-Limit` - Request limit
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Reset timestamp
- `Retry-After` - Seconds until retry allowed

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {} // Optional additional details
}
```

**Common Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Request Validation

All POST/PUT requests should include proper Content-Type headers:
- `Content-Type: application/json` for JSON payloads

---

## Best Practices

1. **Always check response status codes**
2. **Handle rate limiting gracefully**
3. **Implement exponential backoff for retries**
4. **Cache responses when appropriate**
5. **Use HTTPS in production**
6. **Validate all user inputs**

---

## Support

For API issues or questions:
- Check `/api/health` for service status
- Review error messages for details
- Contact support@blackmossandherbs.com
