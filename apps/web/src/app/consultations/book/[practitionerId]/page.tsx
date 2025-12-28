import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/consultations/booking-form";
import { Card, CardHeader, CardTitle, CardDescription } from "@blackmoss/ui";
import { formatCurrency } from "@blackmoss/utils";

export default async function BookConsultationPage({
  params,
}: {
  params: { practitionerId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin?redirect=/consultations");
  }

  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { id: params.practitionerId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      schedules: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
  });

  if (!practitioner || !practitioner.isActive) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Book Consultation</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>
                Choose a time that works for you. All times are shown in your timezone.
              </CardDescription>
            </CardHeader>
            <BookingForm practitioner={practitioner} userId={session.user.id} />
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Practitioner</CardTitle>
              <CardDescription>{practitioner.user.name}</CardDescription>
            </CardHeader>
            <div className="p-6 space-y-4">
              {practitioner.bio && <p className="text-sm">{practitioner.bio}</p>}
              <div>
                <p className="text-sm font-medium mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {practitioner.specialties.map((spec) => (
                    <span key={spec} className="text-xs bg-muted px-2 py-1 rounded">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Price</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(Number(practitioner.consultationPrice))}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Duration</p>
                <p className="text-sm">60 minutes</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
