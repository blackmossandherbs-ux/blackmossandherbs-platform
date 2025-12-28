"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateBreadcrumbsSchema } from "@/lib/seo-advanced";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ name: "Home", url: "/" }, ...items];
  const schema = generateBreadcrumbsSchema(allItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <ol className="flex items-center gap-2">
          {allItems.map((item, index) => (
            <li key={item.url} className="flex items-center gap-2">
              {index === 0 ? (
                <Link href={item.url} className="hover:text-foreground transition-colors">
                  <Home className="h-4 w-4" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4" />
                  {index === allItems.length - 1 ? (
                    <span className="text-foreground font-medium" aria-current="page">
                      {item.name}
                    </span>
                  ) : (
                    <Link href={item.url} className="hover:text-foreground transition-colors">
                      {item.name}
                    </Link>
                  )}
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
