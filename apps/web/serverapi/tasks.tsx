import { PrismaClient, Task } from "@prisma/client";
import { TaskWithClass } from "types";
import { getPrismaPool } from "./prismapool";

export async function getTasksFromId(userId: string): Promise<TaskWithClass[]> {
  try {
    const prisma = getPrismaPool();
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
