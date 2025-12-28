import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription } from "@blackmoss/ui";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@blackmoss/utils";

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
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Blog & News</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              {post.featuredImage && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {post.categories.map((cat) => (
                    <span key={cat.id} className="text-xs text-primary">
                      {cat.name}
                    </span>
                  ))}
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                {post.publishedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(post.publishedAt)}
                  </p>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts available yet.</p>
        </div>
      )}
    </div>
  );
}
