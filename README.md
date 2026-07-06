# Black Moss & Herbs Platform

> **© 2024 HECTIC. All Rights Reserved.**  
> Developed by HECTIC - Premium Herbal Wellness Solutions

A comprehensive global herbal wellness platform featuring eCommerce, subscriptions, digital products, content management, consultations, and admin/CRM capabilities.

## 🌿 Features

- **eCommerce Store**: Full-featured product catalog with cart and checkout
- **Subscription Plans**: Recurring billing with multiple tier options
- **Digital Library**: eBooks, guides, and downloadable resources
- **Content Hub**: Blog articles and video tutorials
- **Consultations**: Book appointments with certified herbalists
- **User Dashboard**: Order tracking, subscriptions, and account management
- **Admin Panel**: Comprehensive store management and analytics
- **Responsive Design**: Beautiful, mobile-first interface

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Deployment**: Production-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/richhabits/blackmossandherbs-platform.git
   cd blackmossandherbs-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   - Database URL (PostgreSQL)
   - NextAuth secret and URL
   - Stripe API keys
   - Email service credentials (optional)

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Local Development (PostgreSQL)

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE blackmossandherbs;
   ```
3. Update your `.env` file with the connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/blackmossandherbs"
   ```

### Production Database

For production, we recommend:
- **Supabase** (Free tier available)
- **Railway** (PostgreSQL hosting)
- **Neon** (Serverless PostgreSQL)
- **AWS RDS** (Enterprise)

## 💳 Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add to `.env`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
4. Set up webhook endpoint for subscriptions:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`

## 🔐 Authentication Setup

1. Generate a NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```
2. Add to `.env`:
   ```
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 🚢 Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

- **Netlify**: Full Next.js support
- **Railway**: Easy deployment with database
- **DigitalOcean App Platform**: Scalable hosting
- **AWS Amplify**: Enterprise solution

## 📁 Project Structure

```
blackmossandherbs-platform/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── admin/            # Admin pages
│   │   ├── blog/             # Blog pages
│   │   ├── cart/             # Shopping cart
│   │   ├── consultations/    # Consultation booking
│   │   ├── dashboard/        # User dashboard
│   │   ├── library/          # Digital library
│   │   ├── shop/             # Product pages
│   │   ├── subscriptions/    # Subscription plans
│   │   ├── videos/           # Video hub
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable components
│   │   ├── Button.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── ProductCard.tsx
│   └── lib/                  # Utilities
│       ├── prisma.ts         # Database client
│       ├── stripe.ts         # Stripe client
│       └── utils.ts          # Helper functions
├── .env.example              # Environment template
├── next.config.js            # Next.js config
├── tailwind.config.js        # Tailwind config
└── package.json              # Dependencies
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:
- `primary`: Main brand color (green)
- `secondary`: Accent color (yellow)
- `earth`: Neutral tones

### Content

- Products: Update mock data in shop pages or connect to database
- Blog posts: Add content through admin panel or database
- Videos: Integrate with video hosting service

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## 📝 Environment Variables

Required variables:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check connection string format
- Ensure database exists

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)

### Stripe Webhooks
- Use Stripe CLI for local testing
- Verify webhook secret matches
- Check endpoint URL is accessible

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support, email support@blackmossandherbs.com or visit our website.

## 🌟 Features Coming Soon

- [ ] Real-time chat support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Loyalty rewards program
- [ ] AI-powered product recommendations

---

Built with ❤️ for natural wellness
