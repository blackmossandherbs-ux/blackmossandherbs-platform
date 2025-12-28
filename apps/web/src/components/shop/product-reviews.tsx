"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@blackmoss/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@blackmoss/ui";
import { Review } from "@prisma/client";

interface ProductReviewsProps {
  productId: string;
  reviews: Array<
    Review & {
      user: {
        name: string | null;
        image: string | null;
      };
    }
  >;
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={review.user.image || undefined} />
                  <AvatarFallback>
                    {review.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{review.user.name || "Anonymous"}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span>{"⭐".repeat(review.rating)}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {review.title && <h3 className="font-semibold mb-2">{review.title}</h3>}
              {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
