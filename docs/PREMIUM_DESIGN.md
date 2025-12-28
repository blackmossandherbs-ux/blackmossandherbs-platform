# Premium Design System Guide

## Overview

The BlackMoss & Herbs platform features a premium design system with high-resolution image support, modern UI components, and beautiful animations.

## Design Principles

1. **Premium Aesthetics**: Clean, modern, sophisticated
2. **High-Quality Images**: Optimized high-resolution images everywhere
3. **Smooth Animations**: Subtle, purposeful transitions
4. **Responsive Design**: Perfect on all devices
5. **Accessibility**: WCAG 2.1 AA compliant

## Color System

### Primary Colors
- **Primary Green**: `hsl(142 76% 36%)` - Main brand color
- **Gradients**: Multiple gradient combinations for premium feel

### Theme Support
- Light mode (default)
- Dark mode (automatic)
- Custom themes via CSS variables

## Typography

- **Headings**: Bold, large, with gradient text support
- **Body**: Clean, readable, optimized line-height
- **Font Features**: Ligatures and contextual alternates enabled

## Components

### Hero Section
```tsx
<HeroSection
  title="Your Title"
  subtitle="Subtitle"
  description="Description"
  image="/high-res-hero.jpg"
  imageAlt="Alt text"
  ctaText="Shop Now"
  ctaLink="/shop"
/>
```

### Product Showcase
```tsx
<ProductShowcase
  product={product}
  priority={true} // For above-the-fold images
/>
```

### Image Gallery
```tsx
<ImageGallery
  images={imageArray}
  alt="Product name"
/>
```

### Optimized Image
```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={800}
  quality={90}
  priority={true}
/>
```

## Image Guidelines

### Recommended Sizes

1. **Hero Images**: 
   - Minimum: 1920x1080px
   - Recommended: 2560x1440px
   - Format: WebP or JPEG
   - Quality: 90-95%

2. **Product Images**:
   - Minimum: 1200x1200px
   - Recommended: 1600x1600px
   - Format: WebP (preferred)
   - Quality: 85-90%

3. **Gallery Images**:
   - Minimum: 1600x1200px
   - Recommended: 2400x1800px
   - Format: WebP
   - Quality: 85%

4. **Feature Images**:
   - Minimum: 800x600px
   - Recommended: 1200x900px
   - Format: WebP
   - Quality: 85%

### Image Optimization

The platform automatically:
- Converts to WebP/AVIF formats
- Generates multiple sizes for responsive images
- Adds blur placeholders for better UX
- Lazy loads images below the fold
- Preloads critical images

### Using Images

1. **Place images in** `/public/images/`
2. **Use OptimizedImage component** for best results
3. **Set priority={true}** for above-the-fold images
4. **Provide proper alt text** for accessibility

## Premium Features

### Animations
- Fade in on scroll
- Slide up effects
- Scale transitions
- Hover effects

### Effects
- Glass morphism
- Gradient overlays
- Premium shadows
- Smooth transitions

### Interactive Elements
- Hover states
- Focus states
- Loading states
- Error states

## Customization

### Theme Colors
Edit `apps/web/src/app/globals.css`:
```css
:root {
  --primary: 142 76% 36%;
  /* Customize other colors */
}
```

### Component Styles
All components use Tailwind CSS with custom utilities:
- `.btn-premium` - Premium button style
- `.card-premium` - Premium card style
- `.text-gradient` - Gradient text
- `.glass` - Glass morphism effect

## Best Practices

1. **Always use high-resolution images** (2x or 3x for retina displays)
2. **Optimize images before uploading** (use tools like ImageOptim)
3. **Use WebP format** when possible
4. **Set appropriate quality** (85-95% for photos, 100% for graphics)
5. **Provide multiple sizes** for responsive design
6. **Use blur placeholders** for better perceived performance
7. **Preload critical images** (hero, above-the-fold)

## Image Sources

### Recommended Sources
- Unsplash (free, high-quality)
- Pexels (free, high-quality)
- Your own photography
- Stock photo services

### Image Requirements
- High resolution (see sizes above)
- Good lighting
- Professional composition
- Relevant to content
- Optimized file size

## Performance

### Image Loading Strategy
1. **Critical images**: Load immediately (priority={true})
2. **Above fold**: Load with high priority
3. **Below fold**: Lazy load
4. **Off-screen**: Load on scroll

### Optimization Tools
- Next.js Image Optimization (automatic)
- Cloudflare Image Resizing (if using CDN)
- Sharp (server-side processing)
- ImageOptim (pre-upload optimization)

## Accessibility

- All images have descriptive alt text
- Decorative images use empty alt=""
- Images are properly sized
- Color contrast meets WCAG standards
- Focus states are visible

## Examples

See:
- `apps/web/src/app/page.tsx` - Homepage with hero
- `apps/web/src/app/shop/page.tsx` - Product grid
- `apps/web/src/app/shop/[slug]/page.tsx` - Product detail

---

**For questions or customization, see the component source files in `components/premium/`**
