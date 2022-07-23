import { Class, PrismaClient } from "@prisma/client";
import { getPrismaPool } from "./prismapool";

export async function getClassesFromId(userId: string): Promise<Class[]> {
  try {
    const prisma = getPrismaPool();
    const classes = await prisma.class.findMany({
      where: {
        userId: userId,
      },
    });
    return classes;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting classes");
  }
}
