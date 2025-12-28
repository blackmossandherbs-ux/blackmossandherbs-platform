import { HeroSection } from "@/components/premium/hero-section";
import { FeaturedSection } from "@/components/premium/featured-section";
import { ProductShowcase } from "@/components/premium/product-showcase";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@blackmoss/ui";
import { Button } from "@blackmoss/ui";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";

export default async function HomePage() {
  // Fetch featured products
  const featuredProducts = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      variants: {
        take: 1,
        orderBy: { price: "asc" },
      },
      reviews: {
        select: { rating: true },
      },
      tags: true,
    },
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Hero image - use a high-quality placeholder or your actual hero image
  const heroImage = "/images/hero-premium.jpg"; // Replace with your high-res hero image

  // Featured sections data
  const wellnessFeatures = [
    {
      title: "Premium Herbal Blends",
      description: "Carefully curated herbal combinations for optimal wellness",
      image: "/images/feature-herbs.jpg",
      imageAlt: "Premium herbal blends",
      link: "/shop?category=herbal-blends",
      badge: "New",
    },
    {
      title: "Expert Consultations",
      description: "Connect with certified practitioners for personalized guidance",
      image: "/images/feature-consultation.jpg",
      imageAlt: "Expert consultation",
      link: "/consultations",
      badge: "Popular",
    },
    {
      title: "Wellness Resources",
      description: "Access our library of guides, videos, and educational content",
      image: "/images/feature-resources.jpg",
      imageAlt: "Wellness resources",
      link: "/blog",
    },
  ];

  const benefits = [
    {
      icon: Leaf,
      title: "100% Natural",
      description: "Pure, organic ingredients sourced from trusted growers",
    },
    {
      icon: Heart,
      title: "Expert Formulated",
      description: "Created by certified herbalists and wellness experts",
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Rigorous testing and quality assurance for every product",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Transform Your Wellness Journey"
        subtitle="Premium Herbal Solutions"
        description="Discover nature's healing power with our carefully curated collection of premium herbs, expert consultations, and comprehensive wellness resources."
        image={heroImage}
        imageAlt="Premium herbal wellness products"
        ctaText="Shop Now"
        ctaLink="/shop"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/blog"
      />

      {/* Benefits Section */}
      <section className="section-premium bg-background">
        <div className="container-premium">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-premium text-center border-0 shadow-lg">
                <CardContent className="p-8 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <benefit.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="section-premium bg-gradient-to-b from-background to-muted/30">
          <div className="container-premium">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-gradient">Featured Products</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover our handpicked selection of premium herbal products
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product, index) => (
                <ProductShowcase
                  key={product.id}
                  product={product}
                  priority={index < 3}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="btn-premium">
                <Link href="/shop">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Sections */}
      <FeaturedSection
        title="Explore Our Offerings"
        subtitle="Wellness Solutions"
        items={wellnessFeatures}
        columns={3}
      />

      {/* CTA Section */}
      <section className="section-premium bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container-premium text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-gradient">Ready to Begin Your Journey?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their wellness with our premium herbal solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="btn-premium">
              <Link href="/shop">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2">
              <Link href="/consultations">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
