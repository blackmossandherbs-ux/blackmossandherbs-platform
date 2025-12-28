# 🚀 Deployment Guide - Black Moss & Herbs Platform

This guide will help you deploy the Black Moss & Herbs platform to production.

## Prerequisites

- [ ] GitHub account
- [ ] Domain name (optional but recommended)
- [ ] PostgreSQL database (Supabase, Railway, or Neon recommended)
- [ ] Stripe account
- [ ] Vercel account (or alternative hosting)

## Step 1: Database Setup

### Option A: Supabase (Recommended - Free Tier Available)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password
6. Save this for later as `DATABASE_URL`

### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL database
4. Copy the connection string from the database settings
5. Save as `DATABASE_URL`

### Option C: Neon

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Save as `DATABASE_URL`

## Step 2: Stripe Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up and complete verification

2. **Get API Keys**
   - Go to Developers → API keys
   - Copy "Publishable key" → Save as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy "Secret key" → Save as `STRIPE_SECRET_KEY`

3. **Create Products (Optional)**
   - Go to Products → Add product
   - Create subscription plans matching your pricing

4. **Set up Webhooks** (After deployment)
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy webhook signing secret → Save as `STRIPE_WEBHOOK_SECRET`

## Step 3: Deploy to Vercel

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   
   In Vercel project settings → Environment Variables, add:

   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:5432/database
   
   # NextAuth
   NEXTAUTH_URL=https://yourdomain.vercel.app
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # App
   NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
   ```

4. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

## Step 4: Database Migration

After deployment, run database migrations:

1. **Using Vercel CLI** (Recommended)
   ```bash
   npm i -g vercel
   vercel login
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```

2. **Or use Prisma Data Platform**
   - Go to [cloud.prisma.io](https://cloud.prisma.io)
   - Connect your database
   - Run migrations from the dashboard

## Step 5: Custom Domain (Optional)

1. **In Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   - Change `NEXTAUTH_URL` to your custom domain
   - Change `NEXT_PUBLIC_APP_URL` to your custom domain
   - Redeploy

3. **Update Stripe Webhook**
   - Change webhook URL to use custom domain
   - Update `STRIPE_WEBHOOK_SECRET` if needed

## Step 6: Post-Deployment Checklist

- [ ] Test homepage loads correctly
- [ ] Verify all pages are accessible
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Verify Stripe checkout (use test mode first)
- [ ] Test subscription signup
- [ ] Verify webhook events are received
- [ ] Test user registration/login
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit
- [ ] Set up monitoring (Vercel Analytics)

## Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Railway

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure environment variables
3. Set build command: `npm run build`
4. Set run command: `npm start`

## Production Optimization

### 1. Enable Caching

Add to `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
}
```

### 2. Image Optimization

Images are automatically optimized by Next.js Image component.

### 3. Database Connection Pooling

For production, use connection pooling:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"
```

### 4. Monitoring

Set up monitoring with:
- Vercel Analytics
- Sentry for error tracking
- LogRocket for session replay

## Security Checklist

- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up CORS properly
- [ ] Implement rate limiting
- [ ] Use Stripe in live mode (not test mode)
- [ ] Set up CSP headers
- [ ] Enable 2FA on all accounts
- [ ] Regular security audits

## Backup Strategy

1. **Database Backups**
   - Enable automatic backups in your database provider
   - Test restore process monthly

2. **Code Backups**
   - GitHub serves as code backup
   - Tag releases: `git tag v1.0.0`

## Scaling Considerations

### When to Scale

- Site receives >10k visitors/day
- Database queries slow down
- Checkout process lags

### How to Scale

1. **Database**: Upgrade to larger instance
2. **Hosting**: Vercel scales automatically
3. **CDN**: Use Vercel Edge Network
4. **Caching**: Implement Redis for sessions

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check database is accessible from Vercel
- Ensure IP whitelist includes Vercel IPs

### Stripe Webhooks Not Working

- Verify webhook URL is correct
- Check webhook secret matches
- Test with Stripe CLI locally first

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Stripe: [support.stripe.com](https://support.stripe.com)
- Database: Check your provider's docs

## Next Steps

After successful deployment:

1. **Add Content**
   - Upload product images
   - Create blog posts
   - Add video content

2. **Configure Email**
   - Set up transactional emails
   - Configure order confirmations
   - Set up newsletter

3. **Marketing**
   - Set up Google Analytics
   - Configure SEO metadata
   - Submit sitemap to search engines

4. **Legal**
   - Add privacy policy
   - Add terms of service
   - Add shipping policy
   - Add return policy

---

🎉 **Congratulations!** Your Black Moss & Herbs platform is now live!
