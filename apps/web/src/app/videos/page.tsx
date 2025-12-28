import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription } from "@blackmoss/ui";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@blackmoss/utils";
import { Play } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export default async function VideosPage() {
  const session = await getServerSession(authOptions);
  const isMember = session?.user?.role === UserRole.CUSTOMER || session?.user?.role === UserRole.ADMIN;

  const videos = await prisma.video.findMany({
    where: {
      publishedAt: { lte: new Date() },
      OR: [
        { access: "FREE" },
        ...(isMember ? [{ access: { in: ["MEMBER_ONLY", "PAID"] } }] : []),
      ],
    },
    include: {
      series: true,
      tags: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 12,
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Video Hub</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Link key={video.id} href={`/videos/${video.slug}`}>
            <Card className="hover:shadow-lg transition-shadow">
              {video.thumbnailUrl && (
                <div className="relative w-full h-48 mb-4 group">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>
              )}
              <CardHeader>
                {video.series && (
                  <p className="text-xs text-primary mb-1">{video.series.name}</p>
                )}
                <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                {video.publishedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(video.publishedAt)}
                  </p>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      {videos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No videos available yet.</p>
        </div>
      )}
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
