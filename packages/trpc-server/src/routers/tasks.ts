import { Prisma } from "@prisma/client";
import superjson from "superjson";
import { TaskWithClass } from "types";
import { z, ZodType } from "zod";
import { createRouter } from "../server/context";
import { prisma } from "../server/db";

export const tasks = createRouter()
	.transformer(superjson)
	.middleware(({ ctx, next }) => {
		if (!ctx.user) {
			throw new Error("Unauthorized");
		}
		return next({ ctx: { user: ctx.user, prisma } });
	})
	.query("all", {
		resolve: async ({ ctx }) => {
			const threeDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);
			const tasks = await ctx.prisma.task.findMany({
				where: {
					AND: [
						{
							user: {
								id: ctx.user.id,
							},
							dueDate: {
								gte: threeDaysAgo,
							},
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
		},
	})

	.query("details", {
		input: z.object({
			sortBy: z
				.enum(["id", ...Object.values(Prisma.TaskScalarFieldEnum)])
				.default("workDate"),
			page: z.number().default(1),
			perPage: z.number().default(10),
			classId: z.string().nullable(),
		}),
		resolve: async ({ ctx, input }) => {
			try {
				const threeDaysFromNow = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);
				threeDaysFromNow.setHours(0, 0, 0, 0);
				const tasks = await ctx.prisma.task.findMany({
					where: {
						AND: [
							{
								user: {
									id: ctx.user.id,
								},
								classId: input.classId ? input.classId : undefined,
								dueDate: {
									gte: threeDaysFromNow,
								},
							},
						],
					},
					orderBy: [
						{
							[input.sortBy]:
								input.sortBy === "updatedAt" || input.sortBy === "createdAt"
									? "desc"
									: "asc",
						},

						{ workDate: "asc" },
					],
					include: {
						class: true,
					},
					take: input.perPage,
					skip: (input.page - 1) * input.perPage,
				});
				return tasks;
			} catch (error: any) {
				console.error(error.message);
				throw new Error("Unable to get tasks");
			}
		},
	})

	.query("today", {
		resolve: async ({ ctx }) => {
			try {
				const today = new Date();
				const twentyFourHoursAgo = new Date(
					today.getTime() - 24 * 60 * 60 * 1000
				);

				const tasks = await ctx.prisma.task.findMany({
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
								userId: ctx.user.id,
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
				throw new Error("Error getting tasks");
			}
		},
	})
	.query("pagecount", {
		input: z.object({
			perPage: z.number().default(10),
			classId: z.string().nullable(),
		}),
		resolve: async ({ ctx, input }) => {
			try {
				const threeDaysFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
				const taskCount = await ctx.prisma.task.count({
					where: {
						user: {
							id: ctx.user.id,
						},
						classId: input.classId ? input.classId : undefined,
						OR: [{ dueDate: { lte: threeDaysFromNow } }, { complete: false }],
					},
				});
				return Math.ceil(taskCount / input.perPage);
			} catch (error: any) {}
		},
	})

	.mutation("edit", {
		input: z.any({}) as ZodType<Partial<TaskWithClass>>,
		resolve: async ({ ctx, input }) => {
			const doc: Partial<TaskWithClass> = input;
			const id = doc.id as string;
			if (!doc.id) {
				throw new Error("Missing Id");
			}

			console.log(doc);

			const classDoc = doc.classId
				? {
						connect: {
							id: doc.classId,
						},
				  }
				: { disconnect: true };

			const updatedTask = await ctx.prisma.task.update({
				where: { id },
				data: {
					id: doc.id,
					title: doc.title,
					complete: doc.complete,
					description: doc.description,
					workDate: doc.workDate || undefined,
					dueDate: doc.dueDate || undefined,
					workTime: doc.workTime,
					class: classDoc,
				},
				include: {
					class: true,
				},
			});
			return updatedTask;
		},
	})

	.mutation("create", {
		input: z.object({
			workTime: z.number().positive().nullable(),
			title: z.string(),
			dueDate: z.date(),
			workDate: z.date(),
			canvasId: z.number().nullable(),
			canvasName: z.string().nullable(),
			canvasDescription: z.string().nullable(),
			canvasURL: z.string().nullable(),
			classId: z.string().nullable(),
		}),
		resolve: async ({ ctx, input }) => {
			const due = new Date(input.dueDate);
			due.setHours(0, 0, 0, 0);
			const classDoc = input.classId
				? {
						connect: {
							id: input.classId,
						},
				  }
				: undefined;
			try {
				const task = await ctx.prisma.task.create({
					data: {
						title: input.title,
						workTime: input.workTime,
						dueDate: due,
						workDate: input.workDate,
						canvasId: input.canvasId,
						canvasName: input.canvasName,
						canvasDescription: input.canvasDescription,
						canvasURL: input.canvasURL,
						class: classDoc,
						user: {
							connect: {
								id: ctx.user.id,
							},
						},
					},
				});
				return task;
			} catch (error: unknown) {
				if (error instanceof Error) {
					throw Error;
				}
				throw new Error("Failed to create task");
			}
		},
	});
