import { PrismaClient } from "@prisma/client";

declare global {
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient();

// @ts-ignore
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
