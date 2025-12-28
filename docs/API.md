# API Documentation

## Authentication

All protected endpoints require authentication via NextAuth session cookie.

## Endpoints

### Products

#### GET `/api/products`
Get list of products.

**Query Parameters:**
- `category` - Filter by category slug
- `tag` - Filter by tag slug
- `search` - Search query
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

#### GET `/api/products/[id]`
Get single product by ID.

### Cart

#### POST `/api/cart/add`
Add item to cart.

**Body:**
```json
{
  "productId": "string",
  "variantId": "string (optional)",
  "quantity": 1
}
```

#### POST `/api/cart/update`
Update cart item quantity.

**Body:**
```json
{
  "itemId": "string",
  "quantity": 1
}
```

#### POST `/api/cart/remove`
Remove item from cart.

**Body:**
```json
{
  "itemId": "string"
}
```

### Checkout

#### POST `/api/checkout/create`
Create checkout session.

**Body:**
```json
{
  "items": [
    {
      "productId": "string",
      "variantId": "string (optional)",
      "quantity": 1
    }
  ],
  "shippingAddress": { ... },
  "billingAddress": { ... },
  "couponCode": "string (optional)"
}
```

### Downloads

#### GET `/api/downloads/[downloadId]`
Download digital product (signed URL).

### Consultations

#### POST `/api/consultations/book`
Book a consultation.

**Body:**
```json
{
  "practitionerId": "string",
  "scheduledAt": "ISO datetime string",
  "intakeForm": { ... },
  "consentAccepted": true
}
```

### AI Chat

#### POST `/api/ai/chat`
Chat with AI concierge.

**Body:**
```json
{
  "message": "string",
  "sessionId": "string (optional)",
  "context": { ... }
}
```

### Stripe Webhooks

#### POST `/api/stripe/webhook`
Stripe webhook endpoint (verify signature).

## Rate Limiting

- API endpoints: 100 requests per minute per IP
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": { ... }
}
```

## Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error
