"use client";

import { useState } from "react";
import { Button } from "@blackmoss/ui";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { CartItem, Product, ProductVariant } from "@prisma/client";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutButtonProps {
  cartItems: Array<
    CartItem & {
      product: Product & {
        variants: ProductVariant[];
      };
      variant: ProductVariant | null;
    }
  >;
}

export function CheckoutButton({ cartItems }: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Create checkout session
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          shippingAddress: {
            // These would come from a form in a real app
            name: "",
            line1: "",
            city: "",
            postalCode: "",
            country: "US",
          },
          billingAddress: {
            name: "",
            line1: "",
            city: "",
            postalCode: "",
            country: "US",
          },
        }),
      });

      const data = await response.json();

      if (data.clientSecret) {
        // Redirect to Stripe Checkout
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });
        }
      } else {
        // Use Payment Intent for custom checkout
        router.push(`/checkout?orderId=${data.orderId}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full" size="lg">
      {loading ? "Processing..." : "Proceed to Checkout"}
    </Button>
  );
}
