import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@blackmoss/utils";
import { Card, CardContent } from "@blackmoss/ui";
import Link from "next/link";
import { generateAdvancedSEO, generateStructuredDataAdvanced } from "@/lib/seo-advanced";
import { generateArticleKeywords } from "@/lib/seo-keywords";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SocialShare } from "@/components/seo/social-share";
import { KeywordsMeta } from "@/components/seo/keywords-meta";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.content.findUnique({
    where: { slug: params.slug },
    include: {
      categories: true,
      tags: true,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const keywords = generateArticleKeywords({
    title: post.title,
    description: post.description,
    categories: post.categories,
    tags: post.tags,
  });

  return generateAdvancedSEO({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || post.description.substring(0, 160),
    keywords,
    image: post.featuredImage || undefined,
    url: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: post.authorName
      ? {
          name: post.authorName,
        }
      : undefined,
    section: post.categories[0]?.name,
    tags: post.tags.map((t) => t.name),
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.categories[0]?.name || "Articles", url: `/blog` },
      { name: post.title, url: `/blog/${post.slug}` },
    ],
  });
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

  const structuredData = generateStructuredDataAdvanced({
    title: post.title,
    description: post.excerpt || post.description,
    image: post.featuredImage || undefined,
    url: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: post.authorName ? { name: post.authorName } : undefined,
    section: post.categories[0]?.name,
    tags: post.tags.map((t) => t.name),
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.categories[0]?.name || "Articles", url: `/blog` },
      { name: post.title, url: `/blog/${post.slug}` },
    ],
  });

  const articleKeywords = generateArticleKeywords({
    title: post.title,
    description: post.description,
    categories: post.categories,
    tags: post.tags,
  });

  return (
    <article className="container mx-auto p-6 max-w-4xl">
      <KeywordsMeta keywords={articleKeywords} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Breadcrumbs
        items={[
          { name: "Blog", url: "/blog" },
          { name: post.categories[0]?.name || "Articles", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      {post.featuredImage && (
        <div className="relative w-full h-96 mb-8">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
          />
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {post.authorName && <span>By {post.authorName}</span>}
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          </div>
          <SocialShare
            url={`/blog/${post.slug}`}
            title={post.title}
            description={post.excerpt || post.description}
            image={post.featuredImage || undefined}
          />
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
                className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
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
                <Card className="card-premium group h-full">
                  {relation.relatedContent.featuredImage && (
                    <div className="relative w-full h-32 mb-2 overflow-hidden">
                      <Image
                        src={relation.relatedContent.featuredImage}
                        alt={relation.relatedContent.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {relation.relatedContent.title}
                    </h3>
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
