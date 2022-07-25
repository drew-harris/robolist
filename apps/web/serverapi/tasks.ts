import { TaskWithClass } from "types";
import { getPrismaPool } from "./prismapool";

export async function getTasksFromId(userId: string): Promise<TaskWithClass[]> {
  try {
    const prisma = getPrismaPool();
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
      },
      orderBy: [
        {
          workDate: "asc",
        },
        {
          id: "asc",
        },
      ],
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

export async function getTodayTasksFromId(
  userId: string
): Promise<TaskWithClass[]> {
  try {
    const today = new Date();
    const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const prisma = getPrismaPool();
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
        workDate: {
          lte: today,
          gte: twentyFourHoursAgo,
        },
      },
      orderBy: [
        {
          workDate: "asc",
        },
        {
          id: "asc",
        },
      ],
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
