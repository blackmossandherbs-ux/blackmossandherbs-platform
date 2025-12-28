import { PrismaClient } from "@prisma/client";

// Read replica connection
const replicaUrl = process.env.DATABASE_REPLICA_URL || process.env.DATABASE_URL;

export const prismaReplica = new PrismaClient({
  datasources: {
    db: {
      url: replicaUrl,
    },
  },
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Helper function to route read queries to replica
export async function readFromReplica<T>(
  query: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await query(prismaReplica);
  } catch (error) {
    console.error("Replica read failed, falling back to primary:", error);
    // Fallback to primary if replica fails
    const { prisma } = await import("@/lib/db");
    return query(prisma);
  }
}

// Example usage:
// const products = await readFromReplica((prisma) => 
//   prisma.product.findMany({ where: { status: "ACTIVE" } })
// );
