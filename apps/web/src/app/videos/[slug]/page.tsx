import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@blackmoss/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@blackmoss/ui";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { VideoPlayer } from "@/components/videos/video-player";

export default async function VideoPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const isMember = session?.user?.role === UserRole.CUSTOMER || session?.user?.role === UserRole.ADMIN;

  const video = await prisma.video.findUnique({
    where: { slug: params.slug },
    include: {
      series: true,
      chapters: {
        orderBy: { order: "asc" },
      },
      tags: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!video || !video.publishedAt) {
    notFound();
  }

  // Check access
  if (video.access === "MEMBER_ONLY" && !isMember) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Members Only</h1>
        <p className="text-muted-foreground mb-4">
          This video is available to members only. Please sign in or become a member to access.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VideoPlayer video={video} />
          <div className="mt-6">
            <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
            {video.description && (
              <p className="text-muted-foreground whitespace-pre-line mb-4">{video.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {video.series && <span>Series: {video.series.name}</span>}
              {video.publishedAt && <span>{formatDate(video.publishedAt)}</span>}
            </div>
          </div>

          {video.chapters.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Chapters</h2>
              <div className="space-y-2">
                {video.chapters.map((chapter) => (
                  <Card key={chapter.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{chapter.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(chapter.startTime)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {video.transcript && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Transcript</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="whitespace-pre-line text-muted-foreground">{video.transcript}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div>
          {video.products.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Related Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {video.products.map((vp) => (
                    <a
                      key={vp.productId}
                      href={`/shop/${vp.product.slug}`}
                      className="flex gap-3 hover:opacity-80"
                    >
                      {vp.product.featuredImage && (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={vp.product.featuredImage}
                            alt={vp.product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{vp.product.name}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
