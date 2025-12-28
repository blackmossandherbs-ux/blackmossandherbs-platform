import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@blackmoss/ui";
import { formatCurrency } from "@blackmoss/utils";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductReviews } from "@/components/shop/product-reviews";
import { ProductFAQ } from "@/components/shop/product-faq";

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

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div>
          {product.featuredImage && (
            <div className="relative w-full h-96 mb-4">
              <Image
                src={product.featuredImage}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          {product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative w-full h-24">
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover rounded" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold">
              {formatCurrency(Number(defaultVariant?.price || product.basePrice))}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through">
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
