import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        // Safe string fallback boundary for build safety phase validation
        url: process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock?schema=public",
      },
    },
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prisma ?? prismaClientSingleton();

export { db };

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;