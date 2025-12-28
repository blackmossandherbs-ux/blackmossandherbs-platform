import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key-change-in-production-32chars";

function signUrl(url: string, expiresIn: number): string {
  const expires = Date.now() + expiresIn;
  const data = `${url}:${expires}`;
  const signature = crypto.createHmac("sha256", ENCRYPTION_KEY).update(data).digest("hex");
  return `${url}?expires=${expires}&signature=${signature}`;
}

function verifySignedUrl(url: string, expires: string, signature: string): boolean {
  const data = `${url}:${expires}`;
  const expectedSignature = crypto.createHmac("sha256", ENCRYPTION_KEY).update(data).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export async function GET(
  req: NextRequest,
  { params }: { params: { downloadId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const download = await prisma.download.findUnique({
      where: { id: params.downloadId },
      include: {
        digitalProduct: true,
      },
    });

    if (!download) {
      return NextResponse.json({ error: "Download not found" }, { status: 404 });
    }

    if (download.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (new Date() > download.expiresAt) {
      return NextResponse.json({ error: "Download link expired" }, { status: 410 });
    }

    if (download.downloadCount >= download.maxDownloads) {
      return NextResponse.json({ error: "Download limit reached" }, { status: 403 });
    }

    // Verify signed URL if present
    const urlParams = new URL(req.url).searchParams;
    const expires = urlParams.get("expires");
    const signature = urlParams.get("signature");

    if (expires && signature) {
      const baseUrl = download.downloadUrl.split("?")[0];
      if (!verifySignedUrl(baseUrl, expires, signature)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      }
      if (Date.now() > parseInt(expires)) {
        return NextResponse.json({ error: "Link expired" }, { status: 410 });
      }
    }

    // Increment download count
    await prisma.download.update({
      where: { id: download.id },
      data: {
        downloadCount: { increment: 1 },
        lastDownloadedAt: new Date(),
      },
    });

    // Generate signed URL for the actual file
    const signedUrl = signUrl(download.downloadUrl, 3600000); // 1 hour expiry

    // Redirect to the file (or return signed URL)
    return NextResponse.redirect(signedUrl);
  } catch (error: any) {
    console.error("Download error:", error);
    return NextResponse.json({ error: error.message || "Download failed" }, { status: 500 });
  }
}
