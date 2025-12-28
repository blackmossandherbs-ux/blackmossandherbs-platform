"use client";

import { Video } from "@prisma/client";
import { Card } from "@blackmoss/ui";

interface VideoPlayerProps {
  video: Video & {
    series?: { name: string } | null;
    chapters?: Array<{ id: string; title: string; startTime: number }>;
  };
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  return (
    <Card>
      <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center">
        <video
          src={video.videoUrl}
          controls
          className="w-full h-full"
          poster={video.thumbnailUrl || undefined}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </Card>
  );
}
