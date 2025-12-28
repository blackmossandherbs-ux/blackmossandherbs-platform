import { prisma } from "@/lib/db";
import { ProductShowcase } from "@/components/premium/product-showcase";
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        <div className="relative z-10 container-premium text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Premium Herbal Shop</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of premium herbal products
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-premium">
        <div className="container-premium">
          {products.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <ProductShowcase
                  key={product.id}
                  product={product}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No products available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
