import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // Prisma 7 ke liye explicit definition safe rehti hai agar schema mein url defined na ho
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
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