import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@blackmoss/ui";
import { formatCurrency } from "@blackmoss/utils";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductReviews } from "@/components/shop/product-reviews";
import { ProductFAQ } from "@/components/shop/product-faq";
import { ImageGallery } from "@/components/premium/image-gallery";
import { OptimizedImage } from "@/components/premium/optimized-image";

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
    },
  });

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  const defaultVariant = product.variants[0];
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  const allImages = product.featuredImage
    ? [product.featuredImage, ...product.images]
    : product.images;

  return (
    <div className="min-h-screen">
      <div className="container-premium py-12">
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

          <AddToCartButton productId={product.id} variantId={defaultVariant?.id} />

          {/* Categories & Tags */}
          {(product.categories.length > 0 || product.tags.length > 0) && (
            <div className="mt-6 pt-6 border-t">
              {product.categories.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm font-medium">Categories: </span>
                  {product.categories.map((cat) => (
                    <span key={cat.id} className="text-sm text-muted-foreground">
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
              {product.tags.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Tags: </span>
                  {product.tags.map((tag) => (
                    <span key={tag.id} className="text-sm text-muted-foreground">
                      #{tag.name}{" "}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="mt-12">
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
