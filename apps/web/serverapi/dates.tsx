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
			_count: {
				workTime: true,
				_all: true,
			},
			_sum: {
				workTime: true,
			},
			orderBy: {
				workDate: "asc",
			},
		});
		return dates.map((date) => ({
			workDate: date.workDate,
			_sum: date._sum,
			simpleTasksCount: date._count._all - date._count.workTime,
			totalWorkTime: date._sum.workTime || 0,
		}));
	} catch (error) {
		console.log(error);
		throw error;
	}
}
