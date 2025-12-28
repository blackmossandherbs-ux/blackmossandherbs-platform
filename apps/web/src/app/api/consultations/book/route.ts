import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const bookConsultationSchema = z.object({
  practitionerId: z.string(),
  scheduledAt: z.string().datetime(),
  intakeForm: z.record(z.any()).optional(),
  consentAccepted: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { practitionerId, scheduledAt, intakeForm, consentAccepted } =
      bookConsultationSchema.parse(body);

    if (!consentAccepted) {
      return NextResponse.json({ error: "Consent required" }, { status: 400 });
    }

    const practitioner = await prisma.practitionerProfile.findUnique({
      where: { id: practitionerId },
    });

    if (!practitioner || !practitioner.isActive) {
      return NextResponse.json({ error: "Practitioner not found" }, { status: 404 });
    }

    // Create consultation
    const consultation = await prisma.consultation.create({
      data: {
        customerId: session.user.id,
        practitionerId,
        scheduledAt: new Date(scheduledAt),
        timezone: practitioner.timezone,
        intakeForm: intakeForm || {},
        consentAccepted: true,
        price: practitioner.consultationPrice,
        currency: practitioner.currency,
        status: "PENDING",
      },
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(practitioner.consultationPrice) * 100),
      currency: practitioner.currency.toLowerCase(),
      metadata: {
        consultationId: consultation.id,
        userId: session.user.id,
        practitionerId,
      },
    });

    // Update consultation with payment intent
    await prisma.consultation.update({
      where: { id: consultation.id },
      data: {
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return NextResponse.json({
      consultationId: consultation.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Booking failed" }, { status: 500 });
  }
}
