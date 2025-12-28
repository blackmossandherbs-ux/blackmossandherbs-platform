"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@blackmoss/ui";
import { Button } from "@blackmoss/ui";
import { formatCurrency } from "@blackmoss/utils";
import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { Product } from "@prisma/client";

interface ProductShowcaseProps {
  product: Product & {
    variants?: Array<{ price: number; compareAtPrice?: number | null }>;
    reviews?: Array<{ rating: number }>;
  };
  priority?: boolean;
}

export function ProductShowcase({ product, priority = false }: ProductShowcaseProps) {
  const price = product.variants?.[0]?.price || product.basePrice;
  const comparePrice = product.variants?.[0]?.compareAtPrice || product.compareAtPrice;
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <Card className="card-premium group h-full flex flex-col">
      <Link href={`/shop/${product.slug}`} className="block flex-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage}
              alt={product.name}
              fill
              priority={priority}
              quality={90}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl">🌿</span>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick view button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              className="glass border-2"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/shop/${product.slug}`;
              }}
            >
              View Product
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Badge */}
          {comparePrice && Number(comparePrice) > Number(price) && (
            <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
              Sale
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-6 space-y-4">
          {/* Category/Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.slice(0, 2).map((tag: any) => (
                <span
                  key={tag.id}
                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews?.length || 0})
              </span>
            </div>
          )}

          {/* Description */}
          {product.shortDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-2xl font-bold">{formatCurrency(Number(price))}</span>
            {comparePrice && Number(comparePrice) > Number(price) && (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(Number(comparePrice))}
              </span>
            )}
          </div>

          {/* CTA */}
          <Button
            className="w-full btn-premium mt-4"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
