"use client";

import Image from "next/image";
import { useState } from "react";
import { getOptimizedImageUrl, generateBlurDataURL, getResponsiveSizes } from "@/lib/image-optimization";
import { cn } from "@blackmoss/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  sizes?: string;
  blur?: boolean;
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 90,
  priority = false,
  className,
  objectFit = "cover",
  sizes,
  blur = true,
  onLoad,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>();

  // Generate blur placeholder
  if (blur && typeof window !== "undefined" && !blurDataUrl) {
    generateBlurDataURL(src).then(setBlurDataUrl);
  }

  const optimizedSrc = getOptimizedImageUrl({
    src,
    width,
    height,
    quality,
    format: "webp",
  });

  const defaultSizes = sizes || getResponsiveSizes();

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        placeholder={blur && blurDataUrl ? "blur" : "empty"}
        blurDataURL={blurDataUrl}
        className={cn(
          "transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill"
        )}
        style={{ objectFit }}
        sizes={defaultSizes}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
      )}
    </div>
  );
}
