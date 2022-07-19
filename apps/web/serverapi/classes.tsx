import { Class, PrismaClient } from "@prisma/client";

export async function getClassesFromId(userId: string): Promise<Class[]> {
  try {
    const prisma = new PrismaClient();
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
