import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@blackmoss/ui";
import { Button } from "@blackmoss/ui";
import { Download, FileText, Music, Book } from "lucide-react";
import { formatDate, formatFileSize } from "@blackmoss/utils";
import Link from "next/link";

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin?redirect=/library");
  }

  const downloads = await prisma.download.findMany({
    where: { userId: session.user.id },
    include: {
      product: true,
      digitalProduct: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return <FileText className="h-8 w-8" />;
    if (mimeType.includes("audio")) return <Music className="h-8 w-8" />;
    if (mimeType.includes("epub")) return <Book className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">My Library</h1>
      {downloads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You don't have any downloads yet.</p>
          <Link href="/shop">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {downloads.map((download) => {
            const isExpired = new Date() > download.expiresAt;
            const canDownload = download.downloadCount < download.maxDownloads && !isExpired;

            return (
              <Card key={download.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {download.digitalProduct && getFileIcon(download.digitalProduct.mimeType)}
                    <div className="flex-1">
                      <CardTitle>{download.product.name}</CardTitle>
                      <CardDescription>
                        {download.digitalProduct?.fileName || "Digital Product"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {download.digitalProduct && (
                      <p className="text-sm text-muted-foreground">
                        Size: {formatFileSize(download.digitalProduct.fileSize)}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Downloads: {download.downloadCount} / {download.maxDownloads}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {formatDate(download.expiresAt)}
                    </p>
                    {download.lastDownloadedAt && (
                      <p className="text-sm text-muted-foreground">
                        Last downloaded: {formatDate(download.lastDownloadedAt)}
                      </p>
                    )}
                  </div>
                  {canDownload ? (
                    <Link href={`/api/downloads/${download.id}`}>
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full" disabled>
                      {isExpired ? "Expired" : "Download Limit Reached"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
