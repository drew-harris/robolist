import { TaskWithClass } from "types";
import { getPrismaPool } from "./prismapool";

export async function getTasksFromUserId(
	userId: string
): Promise<TaskWithClass[]> {
	try {
		const prisma = getPrismaPool();
		const tasks = await prisma.task.findMany({
			where: {
				user: {
					id: userId,
				},
			},
			orderBy: [
				{
					workDate: "asc",
				},
				{
					complete: "asc",
				},
				{
					updatedAt: "desc",
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
				OR: [
					{
						workDate: {
							lte: today,
							gte: twentyFourHoursAgo,
						},
					},
					{
						workDate: {
							lte: today,
						},
						complete: false,
					},
					{
						dueDate: {
							lte: today,
						},
						complete: false,
					},
				],
				AND: [
					{
						userId: userId,
					},
				],
			},
			orderBy: [
				{
					workDate: "asc",
				},
				{
					complete: "asc",
				},
				{
					updatedAt: "desc",
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

export async function getTaskById(
	taskId: string,
	userId: string | undefined = undefined
): Promise<TaskWithClass | null> {
	try {
		const prisma = getPrismaPool();
		const task = await prisma.task.findFirst({
			where: {
				id: taskId,
				userId: userId,
			},
			include: {
				class: true,
			},
		});
		return task;
	} catch (error) {
		console.error(error);
		throw new Error("Error getting classes");
	}
}

export async function getTaskByDate(date: Date, userId: string) {
	const sixHoursBefore = new Date(date.getTime() - 6 * 60 * 60 * 1000);
	const sixHoursAfter = new Date(date.getTime() + 6 * 60 * 60 * 1000);
	try {
		const prisma = getPrismaPool();
		const task = await prisma.task.findMany({
			where: {
				userId: userId,
				workDate: {
					lte: sixHoursAfter,
					gte: sixHoursBefore,
				},
			},
			include: {
				class: true,
			},
		});
		return task;
	} catch (error) {
		console.error(error);
		throw new Error("Error getting classes");
	}
}
