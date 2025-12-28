import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@blackmoss/ui";
import { Card, CardContent } from "@blackmoss/ui";
import { formatCurrency } from "@blackmoss/utils";
import Link from "next/link";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductReviews } from "@/components/shop/product-reviews";
import { ProductFAQ } from "@/components/shop/product-faq";
import { ImageGallery } from "@/components/premium/image-gallery";
import { OptimizedImage } from "@/components/premium/optimized-image";
import { generateAdvancedSEO, generateStructuredDataAdvanced } from "@/lib/seo-advanced";
import { generateProductKeywords } from "@/lib/seo-keywords";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SocialShare } from "@/components/seo/social-share";
import { KeywordsMeta } from "@/components/seo/keywords-meta";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findMany({
    where: { slug: params.slug },
    include: {
      variants: { take: 1 },
      reviews: { select: { rating: true } },
      categories: true,
      tags: true,
    },
  });

  if (!product || product.length === 0) {
    return {
      title: "Product Not Found",
    };
  }

  const p = product[0];
  const price = Number(p.variants[0]?.price || p.basePrice);
  const averageRating =
    p.reviews.length > 0
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      : undefined;

  const keywords = generateProductKeywords({
    name: p.name,
    description: p.description,
    categories: p.categories,
    tags: p.tags,
  });

  return generateAdvancedSEO({
    title: p.name,
    description: p.shortDescription || p.description.substring(0, 160),
    keywords,
    image: p.featuredImage || undefined,
    url: `/shop/${p.slug}`,
    type: "product",
    price: {
      amount: price,
      currency: "USD",
    },
    availability: p.status === "ACTIVE" ? "InStock" : "OutOfStock",
    rating: averageRating
      ? {
          value: averageRating,
          count: p.reviews.length,
        }
      : undefined,
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Shop", url: "/shop" },
      { name: p.categories[0]?.name || "Products", url: `/shop?category=${p.categories[0]?.slug || ""}` },
      { name: p.name, url: `/shop/${p.slug}` },
    ],
  });
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      variants: true,
      categories: true,
      tags: true,
      faqs: {
        orderBy: { order: "asc" },
      },
      reviews: {
        where: { isPublished: true },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        take: 10,
      },
      relatedProducts: {
        include: {
          relatedProduct: {
            select: {
              id: true,
              name: true,
              slug: true,
              featuredImage: true,
            },
          },
        },
        take: 3,
      },
    },
  });

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  const defaultVariant = product.variants[0];

  const allImages = product.featuredImage
    ? [product.featuredImage, ...product.images]
    : product.images;

  const price = Number(defaultVariant?.price || product.basePrice);
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : undefined;

  const structuredData = generateStructuredDataAdvanced({
    title: product.name,
    description: product.shortDescription || product.description,
    image: product.featuredImage || undefined,
    url: `/shop/${product.slug}`,
    type: "product",
    price: {
      amount: price,
      currency: "USD",
    },
    availability: product.status === "ACTIVE" ? "InStock" : "OutOfStock",
    rating: averageRating
      ? {
          value: averageRating,
          count: product.reviews.length,
        }
      : undefined,
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Shop", url: "/shop" },
      { name: product.categories[0]?.name || "Products", url: `/shop` },
      { name: product.name, url: `/shop/${product.slug}` },
    ],
    keywords: [
      ...product.categories.map((c) => c.name),
      ...product.tags.map((t) => t.name),
    ],
  });

  const productKeywords = generateProductKeywords({
    name: product.name,
    description: product.description,
    categories: product.categories,
    tags: product.tags,
  });

  return (
    <div className="min-h-screen">
      <KeywordsMeta keywords={productKeywords} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container-premium py-12">
        <Breadcrumbs
          items={[
            { name: "Shop", url: "/shop" },
            { name: product.categories[0]?.name || "Products", url: "/shop" },
            { name: product.name, url: `/shop/${product.slug}` },
          ]}
        />
        <div className="grid gap-12 md:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            {allImages.length > 0 ? (
              <ImageGallery images={allImages} alt={product.name} />
            ) : (
              <div className="relative aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-6xl">🌿</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gradient">
                  {formatCurrency(Number(defaultVariant?.price || product.basePrice))}
                </span>
                {product.compareAtPrice && (
                  <span className="text-2xl text-muted-foreground line-through">
                    {formatCurrency(Number(product.compareAtPrice))}
                  </span>
                )}
              </div>

          {averageRating > 0 && (
            <div className="mb-4">
              <span className="text-lg">⭐ {averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground ml-2">
                ({product.reviews.length} reviews)
              </span>
            </div>
          )}

          <div className="mb-6">
            <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Select Variant</label>
              <div className="flex gap-2">
                {product.variants.map((variant) => (
                  <Button key={variant.id} variant="outline">
                    {variant.name} - {formatCurrency(Number(variant.price))}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <AddToCartButton productId={product.id} variantId={defaultVariant?.id} />
            <SocialShare
              url={`/shop/${product.slug}`}
              title={product.name}
              description={product.shortDescription || product.description}
              image={product.featuredImage || undefined}
            />
          </div>

          {/* Categories & Tags */}
          {(product.categories.length > 0 || product.tags.length > 0) && (
            <div className="mt-6 pt-6 border-t space-y-3">
              {product.categories.length > 0 && (
                <div>
                  <span className="text-sm font-medium mb-2 block">Categories: </span>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {product.tags.length > 0 && (
                <div>
                  <span className="text-sm font-medium mb-2 block">Tags: </span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/shop?tag=${tag.slug}`}
                        className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-12 container-premium">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {product.relatedProducts.slice(0, 3).map((relation) => (
              <Link key={relation.relatedProduct.id} href={`/shop/${relation.relatedProduct.slug}`}>
                <Card className="card-premium group">
                  {relation.relatedProduct.featuredImage && (
                    <div className="relative aspect-square overflow-hidden">
                      <OptimizedImage
                        src={relation.relatedProduct.featuredImage}
                        alt={relation.relatedProduct.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {relation.relatedProduct.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="mt-12 container-premium">
          <ProductReviews productId={product.id} reviews={product.reviews} />
        </div>
      )}

      {/* FAQs */}
      {product.faqs.length > 0 && (
        <div className="mt-12">
          <ProductFAQ faqs={product.faqs} />
        </div>
      )}
    </div>
  );
}
