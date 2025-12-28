import { ProductSkeleton } from "@/components/premium/skeleton-loader";

export default function Loading() {
  return (
    <div className="container-premium py-12">
      <div className="grid gap-12 md:grid-cols-2">
        <ProductSkeleton />
        <div className="space-y-6">
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-8 bg-muted rounded animate-pulse w-1/2" />
          <div className="h-32 bg-muted rounded animate-pulse" />
          <div className="h-12 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
