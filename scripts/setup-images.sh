#!/bin/bash
set -e

echo "🖼️  Setting up High-Resolution Images"
echo "======================================"
echo ""

# Create images directory structure
mkdir -p public/images/{hero,products,gallery,features,blog,videos}

echo "✅ Created image directories:"
echo "  - public/images/hero/       (Hero images: 2560x1440px)"
echo "  - public/images/products/   (Product images: 1600x1600px)"
echo "  - public/images/gallery/    (Gallery images: 2400x1800px)"
echo "  - public/images/features/   (Feature images: 1200x900px)"
echo "  - public/images/blog/       (Blog images: 1200x900px)"
echo "  - public/images/videos/     (Video thumbnails: 800x600px)"
echo ""

# Create README for image guidelines
cat > public/images/README.md <<'EOF'
# Image Guidelines

## Recommended Sizes & Formats

### Hero Images (`hero/`)
- **Size**: 2560x1440px (minimum 1920x1080px)
- **Format**: WebP or JPEG
- **Quality**: 90-95%
- **Usage**: Homepage hero, section headers

### Product Images (`products/`)
- **Size**: 1600x1600px (minimum 1200x1200px)
- **Format**: WebP (preferred) or JPEG
- **Quality**: 85-90%
- **Usage**: Product listings, product detail pages

### Gallery Images (`gallery/`)
- **Size**: 2400x1800px (minimum 1600x1200px)
- **Format**: WebP
- **Quality**: 85%
- **Usage**: Image galleries, lightboxes

### Feature Images (`features/`)
- **Size**: 1200x900px (minimum 800x600px)
- **Format**: WebP or JPEG
- **Quality**: 85%
- **Usage**: Feature sections, cards

### Blog Images (`blog/`)
- **Size**: 1200x900px (minimum 800x600px)
- **Format**: WebP or JPEG
- **Quality**: 85%
- **Usage**: Blog post featured images

### Video Thumbnails (`videos/`)
- **Size**: 800x600px
- **Format**: WebP or JPEG
- **Quality**: 80%
- **Usage**: Video thumbnails

## Image Sources

### Free High-Quality Sources
- **Unsplash**: https://unsplash.com (free, high-quality)
- **Pexels**: https://www.pexels.com (free, high-quality)
- **Pixabay**: https://pixabay.com (free)

### Optimization Tools
- **ImageOptim**: https://imageoptim.com (Mac)
- **Squoosh**: https://squoosh.app (Web)
- **Sharp**: npm package for programmatic optimization

## Usage in Code

```tsx
// Hero image
<HeroSection image="/images/hero/your-image.jpg" />

// Product image
<OptimizedImage src="/images/products/product.jpg" />

// Gallery
<ImageGallery images={["/images/gallery/1.jpg", ...]} />
```

## Naming Convention

- Use kebab-case: `product-name.jpg`
- Be descriptive: `herbal-tea-blend-premium.jpg`
- Include size if multiple: `hero-large.jpg`, `hero-small.jpg`

## Tips

1. **Optimize before upload**: Compress images to reduce file size
2. **Use WebP**: Better compression than JPEG
3. **Provide alt text**: Always include descriptive alt text
4. **Test on retina**: Ensure images look good on high-DPI displays
5. **Lazy load**: Images below fold are automatically lazy loaded
EOF

echo "✅ Created image guidelines: public/images/README.md"
echo ""
echo "📝 Next steps:"
echo "  1. Add your high-resolution images to the appropriate directories"
echo "  2. Optimize images using tools like ImageOptim or Squoosh"
echo "  3. Update image paths in your components"
echo "  4. Test on different devices and screen sizes"
echo ""
echo "💡 Recommended image sources:"
echo "  - Unsplash: https://unsplash.com"
echo "  - Pexels: https://www.pexels.com"
echo ""
