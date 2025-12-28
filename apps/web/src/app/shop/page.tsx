import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@blackmoss/ui";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@blackmoss/ui";
import { formatCurrency } from "@blackmoss/utils";

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      variants: {
        take: 1,
        orderBy: {
          price: "asc",
        },
      },
      categories: {
        take: 1,
      },
    },
    take: 12,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Shop</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const price = product.variants[0]?.price || product.basePrice;
          const comparePrice = product.variants[0]?.compareAtPrice || product.compareAtPrice;

          return (
            <Link key={product.id} href={`/shop/${product.slug}`}>
              <Card className="hover:shadow-lg transition-shadow">
                {product.featuredImage && (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={product.featuredImage}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.shortDescription || product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold">
                      {formatCurrency(Number(price))}
                    </span>
                    {comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(Number(comparePrice))}
                      </span>
                    )}
                  </div>
                  <Button className="w-full">View Product</Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available yet.</p>
        </div>
      )}
    </div>
  );
}
