/**
 * Image optimization utilities for high-resolution images
 */

export interface ImageConfig {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpeg" | "png";
  blur?: boolean;
}

/**
 * Generate optimized image URL with Cloudflare Image Resizing or Next.js Image Optimization
 */
export function getOptimizedImageUrl(config: ImageConfig): string {
  const { src, width, height, quality = 90, format = "webp" } = config;

  // If using Cloudflare CDN
  if (process.env.CDN_PROVIDER === "cloudflare" && process.env.CDN_URL) {
    const params = new URLSearchParams();
    if (width) params.set("width", width.toString());
    if (height) params.set("height", height.toString());
    params.set("quality", quality.toString());
    params.set("format", format);
    params.set("fit", "cover");

    return `${process.env.CDN_URL}/${src}?${params.toString()}`;
  }

  // Fallback to original or Next.js optimization
  return src;
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  baseSrc: string,
  sizes: number[] = [400, 800, 1200, 1600, 2000]
): string {
  return sizes
    .map((size) => {
      const url = getOptimizedImageUrl({
        src: baseSrc,
        width: size,
        quality: 85,
      });
      return `${url} ${size}w`;
    })
    .join(", ");
}

/**
 * Get responsive sizes attribute
 */
export function getResponsiveSizes(breakpoints?: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string {
  const {
    mobile = "100vw",
    tablet = "50vw",
    desktop = "33vw",
  } = breakpoints || {};

  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`;
}

/**
 * Generate placeholder for blur effect
 */
export async function generateBlurDataURL(src: string): Promise<string> {
  // In production, use a service like Cloudinary or generate on server
  // For now, return a tiny base64 placeholder
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad">
          <stop offset="0%" stop-color="#f0f0f0"/>
          <stop offset="50%" stop-color="#e0e0e0"/>
          <stop offset="100%" stop-color="#f0f0f0"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(shimmer(400, 400))}`;
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, as: "image" = "image") {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = as;
  link.href = src;
  link.fetchPriority = "high";
  document.head.appendChild(link);
}
