"use client";

import Image from "next/image";
import { Card, CardContent } from "@blackmoss/ui";
import { Button } from "@blackmoss/ui";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface FeaturedItem {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  link: string;
  badge?: string;
}

interface FeaturedSectionProps {
  title: string;
  subtitle?: string;
  items: FeaturedItem[];
  columns?: 2 | 3 | 4;
}

export function FeaturedSection({
  title,
  subtitle,
  items,
  columns = 3,
}: FeaturedSectionProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <section className="section-premium bg-gradient-to-b from-background to-muted/30">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          {subtitle && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{subtitle}</span>
            </div>
          )}
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-gradient">{title}</span>
          </h2>
        </div>

        {/* Grid */}
        <div className={`grid gap-8 ${gridCols[columns]}`}>
          {items.map((item, index) => (
            <Card
              key={index}
              className="card-premium group overflow-hidden"
            >
              <Link href={item.link} className="block">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    quality={90}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {item.badge && (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      {item.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <Button variant="ghost" className="group/btn">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
