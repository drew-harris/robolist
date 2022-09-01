import { Prisma } from "@prisma/client";
import superjson from "superjson";
import { z } from "zod";
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
			const threeDaysFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
			const tasks = ctx.prisma.task.findMany({
				where: {
					user: {
						id: ctx.user.id,
					},
					dueDate: {
						lte: threeDaysFromNow,
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
				const threeDaysFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
				const tasks = await ctx.prisma.task.findMany({
					where: {
						user: {
							id: ctx.user.id,
						},
						classId: input.classId ? input.classId : undefined,
						OR: [{ dueDate: { lte: threeDaysFromNow } }, { complete: false }],
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
	});
