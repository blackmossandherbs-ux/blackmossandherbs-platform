"use client";

import Image from "next/image";
import { Button } from "@blackmoss/ui";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  imageAlt: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  ctaText = "Explore Now",
  ctaLink = "/shop",
  secondaryCtaText,
  secondaryCtaLink,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          quality={95}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-premium text-center animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 animate-slide-up">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{subtitle}</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-slide-up [animation-delay:0.1s]">
            <span className="text-gradient">{title}</span>
          </h1>

          {/* Description */}
          {description && (
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:0.2s]">
              {description}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up [animation-delay:0.3s]">
            <Button asChild size="lg" className="btn-premium text-lg px-8 py-6">
              <Link href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {secondaryCtaText && secondaryCtaLink && (
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
