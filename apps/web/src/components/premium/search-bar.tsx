"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@blackmoss/ui";
import { Button } from "@blackmoss/ui";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@blackmoss/ui";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    featuredImage?: string | null;
    basePrice: number;
  }>;
  content: Array<{
    id: string;
    title: string;
    slug: string;
    featuredImage?: string | null;
  }>;
  videos: Array<{
    id: string;
    title: string;
    slug: string;
    thumbnailUrl?: string | null;
  }>;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      setResults(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search products, articles, videos..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          onFocus={() => {
            if (results) setIsOpen(true);
          }}
          className="pr-10 pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
        {query && !isLoading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setQuery("");
              setResults(null);
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && results && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-[600px] overflow-y-auto shadow-xl">
          <CardContent className="p-0">
            {results.total === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : (
              <div className="divide-y">
                {/* Products */}
                {results.products.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Products</h3>
                    <div className="space-y-2">
                      {results.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.slug}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {product.featuredImage && (
                            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={product.featuredImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                {results.content.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Articles</h3>
                    <div className="space-y-2">
                      {results.content.map((item) => (
                        <Link
                          key={item.id}
                          href={`/blog/${item.slug}`}
                          className="block p-2 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <p className="font-medium">{item.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {results.videos.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Videos</h3>
                    <div className="space-y-2">
                      {results.videos.map((video) => (
                        <Link
                          key={video.id}
                          href={`/videos/${video.slug}`}
                          className="block p-2 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <p className="font-medium">{video.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* View All */}
                <div className="p-4 border-t">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={`/search?q=${encodeURIComponent(query)}`}>
                      View All Results
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
