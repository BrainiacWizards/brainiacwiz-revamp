import { PrismaClient } from "@/lib/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withOptimize } from "@prisma/extension-optimize";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient()
		.$extends(withAccelerate())
		.$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY! }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
