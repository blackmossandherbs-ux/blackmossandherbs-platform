import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@blackmoss/utils";
import { Card, CardContent } from "@blackmoss/ui";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.content.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.content.findUnique({
    where: { slug: params.slug },
    include: {
      categories: true,
      tags: true,
      relatedContent: {
        include: {
          relatedContent: true,
        },
        take: 3,
      },
    },
  });

  if (!post || post.status !== "PUBLISHED" || !post.publishedAt) {
    notFound();
  }

  return (
    <article className="container mx-auto p-6 max-w-4xl">
      {post.featuredImage && (
        <div className="relative w-full h-96 mb-8">
          <Image src={post.featuredImage} alt={post.title} fill className="object-cover rounded-lg" />
        </div>
      )}

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {post.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog/category/${cat.slug}`}
              className="text-sm text-primary hover:underline"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.excerpt && <p className="text-xl text-muted-foreground mb-4">{post.excerpt}</p>}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {post.authorName && <span>By {post.authorName}</span>}
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        </div>
      </header>

      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="text-sm text-primary hover:underline"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {post.relatedContent.length > 0 && (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {post.relatedContent.map((relation) => (
              <Link key={relation.relatedContent.id} href={`/blog/${relation.relatedContent.slug}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  {relation.relatedContent.featuredImage && (
                    <div className="relative w-full h-32 mb-2">
                      <Image
                        src={relation.relatedContent.featuredImage}
                        alt={relation.relatedContent.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2">{relation.relatedContent.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
