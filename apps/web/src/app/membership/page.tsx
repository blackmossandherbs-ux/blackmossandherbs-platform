import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@blackmoss/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blackmoss/ui";
import { formatCurrency, formatDate } from "@blackmoss/utils";
import Link from "next/link";

export default async function MembershipPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin?redirect=/membership");
  }

  const [orders, subscriptions, downloads, consultations, loyaltyPoints] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscription.findMany({
      where: { userId: session.user.id },
      take: 5,
    }),
    prisma.download.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      take: 10,
    }),
    prisma.consultation.findMany({
      where: { customerId: session.user.id },
      include: { practitioner: { include: { user: true } } },
      take: 5,
    }),
    prisma.loyaltyPoint.aggregate({
      where: { userId: session.user.id },
      _sum: { points: true },
    }),
  ]);

  const totalPoints = loyaltyPoints._sum.points || 0;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Membership Portal</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{orders.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {subscriptions.filter((s) => s.status === "ACTIVE").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order {order.orderNumber}</CardTitle>
                      <CardDescription>{formatDate(order.createdAt)}</CardDescription>
                    </div>
                    <span className="text-lg font-bold">{formatCurrency(Number(order.total))}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>{formatCurrency(Number(item.total))}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Status: {order.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No orders yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="subscriptions">
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <Card key={sub.id}>
                <CardHeader>
                  <CardTitle>{sub.boxName || "Subscription Box"}</CardTitle>
                  <CardDescription>
                    {sub.frequency} • {formatCurrency(Number(sub.price))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Status: {sub.status}</p>
                  {sub.nextShipmentDate && (
                    <p className="text-sm text-muted-foreground">
                      Next shipment: {formatDate(sub.nextShipmentDate)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            {subscriptions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No active subscriptions.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="downloads">
          <div className="grid gap-4 md:grid-cols-2">
            {downloads.map((download) => (
              <Card key={download.id}>
                <CardHeader>
                  <CardTitle>{download.product.name}</CardTitle>
                  <CardDescription>
                    Downloads: {download.downloadCount} / {download.maxDownloads}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/api/downloads/${download.id}`}>
                    <span className="text-sm text-primary hover:underline">Download</span>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {downloads.length === 0 && (
              <p className="text-center text-muted-foreground py-8 col-span-2">
                No downloads yet.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="consultations">
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card key={consultation.id}>
                <CardHeader>
                  <CardTitle>
                    Consultation with {consultation.practitioner.user.name || "Practitioner"}
                  </CardTitle>
                  <CardDescription>{formatDate(consultation.scheduledAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Status: {consultation.status}</p>
                  {consultation.meetingUrl && (
                    <a
                      href={consultation.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Join Meeting
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
            {consultations.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No consultations yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
