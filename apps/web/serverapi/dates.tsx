import { log } from "next-axiom";
import { DateAggregation, UserWithoutPassword } from "types";
import { getPrismaPool } from "./prismapool";

export async function getDates(
  user: UserWithoutPassword
): Promise<DateAggregation[]> {
  try {
    const prisma = getPrismaPool();
    const dates = await prisma.task.groupBy({
      where: {
        userId: user.id,
        complete: false,
      },
      by: ["workDate"],
      _count: true,
      _sum: {
        workTime: true,
      },
    });
    return dates;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
