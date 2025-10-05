import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withOptimize } from "@prisma/extension-optimize";

const prisma = new PrismaClient()
  .$extends(withAccelerate())
  .$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY! }));

export default prisma;
