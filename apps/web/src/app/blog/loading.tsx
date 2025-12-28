import { BlogPostSkeleton } from "@/components/premium/skeleton-loader";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div className="h-16 bg-muted rounded w-1/2 animate-pulse" />
      </div>
      <section className="section-premium">
        <div className="container-premium">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <BlogPostSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
