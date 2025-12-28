import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@blackmoss/ui";
import { Button } from "@blackmoss/ui";
import Link from "next/link";
import { formatCurrency } from "@blackmoss/utils";
import { Calendar, Clock, Globe } from "lucide-react";

export default async function ConsultationsPage() {
  const practitioners = await prisma.practitionerProfile.findMany({
    where: { isActive: true },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Book a Consultation</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Connect with our expert practitioners for personalized wellness guidance. All consultations
        are conducted online with flexible scheduling across timezones.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {practitioners.map((practitioner) => (
          <Card key={practitioner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{practitioner.user.name || "Practitioner"}</CardTitle>
              <CardDescription>
                {practitioner.specialties.join(", ") || "Wellness Expert"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {practitioner.bio && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{practitioner.bio}</p>
              )}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatCurrency(Number(practitioner.consultationPrice))}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>60 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{practitioner.languages.join(", ") || "English"}</span>
                </div>
              </div>
              <Link href={`/consultations/book/${practitioner.id}`}>
                <Button className="w-full">Book Consultation</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {practitioners.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No practitioners available at this time.</p>
        </div>
      )}
    </div>
  );
}
