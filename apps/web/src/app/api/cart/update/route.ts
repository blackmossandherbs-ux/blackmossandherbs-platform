import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateCartSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(0),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { itemId, quantity } = updateCartSchema.parse(body);

    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: itemId, userId: session.user.id },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId, userId: session.user.id },
        data: { quantity },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to update cart" }, { status: 500 });
  }
}
