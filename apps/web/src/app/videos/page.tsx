import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@blackmoss/ui";
import Link from "next/link";
import { formatDate } from "@blackmoss/utils";
import { Play, Clock } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { OptimizedImage } from "@/components/premium/optimized-image";

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        <div className="relative z-10 container-premium text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Video Hub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn from expert practitioners and discover wellness insights
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="section-premium">
        <div className="container-premium">
          {videos.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, index) => (
                <Link key={video.id} href={`/videos/${video.slug}`}>
                  <Card className="card-premium h-full group overflow-hidden">
                    {video.thumbnailUrl && (
                      <div className="relative w-full aspect-video overflow-hidden">
                        <OptimizedImage
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          quality={85}
                          priority={index < 3}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {formatDuration(video.duration)}
                          </div>
                        )}
                        {video.series && (
                          <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-full font-medium">
                            {video.series.name}
                          </div>
                        )}
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {video.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {video.publishedAt && (
                        <p className="text-sm text-muted-foreground">
                          {formatDate(video.publishedAt)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No videos available yet.</p>
            </div>
          )}
        </div>
      </section>
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
