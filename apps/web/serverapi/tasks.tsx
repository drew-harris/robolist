import { PrismaClient, Task } from "@prisma/client";

export async function getTasksFromId(userId: string): Promise<Task[]> {
  try {
    const prisma = new PrismaClient();
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
      },
      include: {
        class: true,
      },
    });
    return tasks;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting classes");
  }
}
