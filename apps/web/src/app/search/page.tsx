import { Suspense } from "react";
import { SearchResults } from "@/components/search/search-results";
import { ProductSkeleton, BlogPostSkeleton } from "@/components/premium/skeleton-loader";
import { Input } from "@blackmoss/ui";
import { Button } from "@blackmoss/ui";
import { Search } from "lucide-react";

export const metadata = {
  title: "Search - BlackMoss & Herbs",
  description: "Search our products, articles, and videos",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const query = searchParams.q || "";
  const type = searchParams.type || "all";

  return (
    <div className="min-h-screen">
      <section className="section-premium bg-gradient-to-b from-background to-muted/30">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
              <span className="text-gradient">Search</span>
            </h1>
            <form action="/search" method="get" className="flex gap-4">
              <Input
                name="q"
                type="search"
                placeholder="Search products, articles, videos..."
                defaultValue={query}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {query && (
        <section className="section-premium">
          <div className="container-premium">
            <Suspense
              fallback={
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <SearchResults query={query} type={type} />
            </Suspense>
          </div>
        </section>
      )}
    </div>
  );
}
