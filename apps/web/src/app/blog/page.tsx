import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@blackmoss/ui";
import Link from "next/link";
import { formatDate } from "@blackmoss/utils";
import { OptimizedImage } from "@/components/premium/optimized-image";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog - BlackMoss & Herbs",
  description: "Discover wellness insights, herbal guides, and expert advice",
};

export default async function BlogPage() {
  const posts = await prisma.content.findMany({
    where: {
      status: "PUBLISHED",
      type: { in: ["ARTICLE", "GUIDE", "NEWS"] },
      publishedAt: { lte: new Date() },
    },
    include: {
      categories: true,
      tags: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 12,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        <div className="relative z-10 container-premium text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Wellness Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover insights, guides, and expert advice on herbal wellness
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section-premium">
        <div className="container-premium">
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="card-premium h-full group">
                    {post.featuredImage && (
                      <div className="relative w-full h-64 overflow-hidden">
                        <OptimizedImage
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          quality={85}
                          priority={index < 3}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {post.categories.map((cat) => (
                          <span
                            key={cat.id}
                            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 mt-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {post.publishedAt && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            {formatDate(post.publishedAt)}
                          </p>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No posts available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
