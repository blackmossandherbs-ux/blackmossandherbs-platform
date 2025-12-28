import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@blackmoss/ui";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@blackmoss/utils";

export default async function AdminAIPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/auth/signin?error=Unauthorized");
  }

  // Get AI usage stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayUsage, totalUsage, cacheStats] = await Promise.all([
    prisma.aIConversation.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { tokensUsed: true, cost: true },
      _count: true,
    }),
    prisma.aIConversation.aggregate({
      _sum: { tokensUsed: true, cost: true },
      _count: true,
    }),
    prisma.aICache.aggregate({
      _sum: { hitCount: true },
      _count: true,
    }),
  ]);

  const dailyCost = todayUsage._sum.cost || 0;
  const totalCost = totalUsage._sum.cost || 0;
  const cacheHitRate =
    totalUsage._count._all > 0
      ? ((cacheStats._sum.hitCount || 0) / totalUsage._count._all) * 100
      : 0;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Cost Control Panel</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Today's Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(dailyCost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Today's Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{todayUsage._count._all}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{cacheHitRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider Settings</CardTitle>
          <CardDescription>Configure AI provider availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ollama (Local, Free)</p>
                <p className="text-sm text-muted-foreground">Default provider</p>
              </div>
              <span className="text-sm text-green-600">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Google Gemini</p>
                <p className="text-sm text-muted-foreground">Free tier available</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {process.env.AI_ENABLE_GOOGLE === "true" ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">OpenAI</p>
                <p className="text-sm text-muted-foreground">Paid API</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {process.env.AI_ENABLE_OPENAI === "true" ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Anthropic Claude</p>
                <p className="text-sm text-muted-foreground">Paid API</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {process.env.AI_ENABLE_ANTHROPIC === "true" ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
