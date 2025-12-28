import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CartItems } from "@/components/cart/cart-items";
import { CheckoutButton } from "@/components/cart/checkout-button";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin?redirect=/cart");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          variants: true,
        },
      },
      variant: true,
    },
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.variant?.price || item.product.basePrice);
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const shipping = cartItems.some((item) => item.product.type !== "DIGITAL") ? 10 : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <a href="/shop" className="text-primary hover:underline">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <CartItems items={cartItems} />
          </div>
          <div>
            <div className="border rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {shipping > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <CheckoutButton cartItems={cartItems} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
