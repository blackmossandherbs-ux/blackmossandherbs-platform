import { prisma } from "@/lib/db";
import { ProductShowcase } from "@/components/premium/product-showcase";
import { Card, CardHeader, CardTitle, CardContent } from "@blackmoss/ui";
import Link from "next/link";
import { OptimizedImage } from "@/components/premium/optimized-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blackmoss/ui";

interface SearchResultsProps {
  query: string;
  type: string;
}

export async function SearchResults({ query, type }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Enter a search query to get started.</p>
      </div>
    );
  }

  const [products, content, videos] = await Promise.all([
    type === "all" || type === "products"
      ? prisma.product.findMany({
          where: {
            status: "ACTIVE",
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { shortDescription: { contains: query, mode: "insensitive" } },
            ],
          },
          include: {
            variants: { take: 1 },
            reviews: { select: { rating: true } },
            tags: true,
          },
          take: 20,
        })
      : Promise.resolve([]),
    type === "all" || type === "content"
      ? prisma.content.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          },
          include: { categories: true },
          take: 20,
        })
      : Promise.resolve([]),
    type === "all" || type === "videos"
      ? prisma.video.findMany({
          where: {
            publishedAt: { not: null },
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          include: { series: true },
          take: 20,
        })
      : Promise.resolve([]),
  ]);

  const totalResults = products.length + content.length + videos.length;

  if (totalResults === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground mb-4">
          No results found for "{query}"
        </p>
        <p className="text-muted-foreground">Try different keywords or browse our categories.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted-foreground mb-8">
        Found {totalResults} result{totalResults !== 1 ? "s" : ""} for "{query}"
      </p>

      <Tabs defaultValue={type === "all" ? "all" : type} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="content">Articles ({content.length})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-12 mt-8">
          {products.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Products</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductShowcase key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {content.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Articles</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {content.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="card-premium h-full group">
                      {post.featuredImage && (
                        <div className="relative w-full h-48 overflow-hidden">
                          <OptimizedImage
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Videos</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <Link key={video.id} href={`/videos/${video.slug}`}>
                    <Card className="card-premium h-full group">
                      {video.thumbnailUrl && (
                        <div className="relative w-full aspect-video overflow-hidden">
                          <OptimizedImage
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {video.title}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="mt-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductShowcase key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="card-premium h-full group">
                  {post.featuredImage && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <OptimizedImage
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Link key={video.id} href={`/videos/${video.slug}`}>
                <Card className="card-premium h-full group">
                  {video.thumbnailUrl && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <OptimizedImage
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {video.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
