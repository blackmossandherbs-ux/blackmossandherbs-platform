"use client";

import { Card, CardContent } from "@blackmoss/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@blackmoss/ui";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  image?: string;
  rating: number;
  comment: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
}

export function TestimonialsSection({
  testimonials,
  title = "What Our Customers Say",
}: TestimonialsSectionProps) {
  return (
    <section className="section-premium bg-muted/30">
      <div className="container-premium">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{title}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="card-premium h-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <Quote className="h-8 w-8 text-primary/30 mb-2" />

                <p className="text-muted-foreground italic line-clamp-4">
                  "{testimonial.comment}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar>
                    <AvatarImage src={testimonial.image} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
