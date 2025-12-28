"use client";

import { useState } from "react";
import { Button } from "@blackmoss/ui";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string | null;
  quantity?: number;
}

export function AddToCartButton({ productId, variantId, quantity = 1 }: AddToCartButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/auth/signin?redirect=/shop");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          variantId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      router.refresh();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleAddToCart} disabled={loading} className="w-full" size="lg">
      <ShoppingCart className="mr-2 h-4 w-4" />
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
