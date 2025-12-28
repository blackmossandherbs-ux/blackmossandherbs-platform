"use client";

import { CartItem } from "@prisma/client";
import { Product, ProductVariant } from "@prisma/client";
import { formatCurrency } from "@blackmoss/utils";
import { Button } from "@blackmoss/ui";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CartItemsProps {
  items: Array<
    CartItem & {
      product: Product & {
        variants: ProductVariant[];
      };
      variant: ProductVariant | null;
    }
  >;
}

export function CartItems({ items }: CartItemsProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(itemId);
      return;
    }

    setUpdating(itemId);
    try {
      await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      router.refresh();
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const price = Number(item.variant?.price || item.product.basePrice);
        const total = price * item.quantity;

        return (
          <div key={item.id} className="border rounded-lg p-4 flex gap-4">
            {item.product.featuredImage && (
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.product.featuredImage}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{item.product.name}</h3>
              {item.variant && <p className="text-sm text-muted-foreground">{item.variant.name}</p>}
              <p className="text-lg font-bold mt-2">{formatCurrency(total)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={updating === item.id}
              >
                -
              </Button>
              <span className="w-12 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={updating === item.id}
              >
                +
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                disabled={updating === item.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
