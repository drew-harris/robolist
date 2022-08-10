import superjson from "superjson";
import { z } from "zod";
import { createRouter } from "../server/context";
import { getPrismaPool } from "../utils";

export const daily = createRouter()
	.transformer(superjson)
	.middleware(({ ctx, next }) => {
		if (!ctx.user) {
			throw new Error("Unauthorized");
		}
		return next({ ctx: { user: ctx.user } });
	})

	.query("all", {
		resolve: async ({ ctx }) => {
			try {
				const prisma = getPrismaPool();
				const dailies = await prisma.daily.findMany({
					where: {
						user: {
							id: ctx.user.id,
						},
					},
					include: {
						class: true,
					},
					orderBy: {
						lastCompleted: "asc",
					},
				});
				return dailies;
			} catch (err: any) {
				throw new Error("Failed to get daily tasks");
			}
		},
	})

	.mutation("create", {
		input: z.object({
			days: z.number().array().min(1).max(7),
			title: z.string().min(1).max(50),
			classId: z.string().min(1).nullable(),
		}),
		resolve: async ({ ctx, input }) => {
			try {
				const prisma = getPrismaPool();
				const early = new Date();
				early.setFullYear(early.getFullYear() - 3);

				let classDoc = input.classId
					? {
							connect: {
								id: input.classId,
							},
					  }
					: undefined;

				const dailyTask = prisma.daily.create({
					data: {
						title: input.title,
						class: classDoc,
						user: {
							connect: {
								id: ctx.user.id,
							},
						},
						days: input.days,
						lastCompleted: early,
					},

					include: {
						class: true,
					},
				});
				return dailyTask;
			} catch (error) {
				throw new Error("Could not create daily task");
			}
		},
	})

	.mutation("complete", {
		input: z.string(),
		resolve: async ({ ctx, input: id }) => {
			try {
				const prisma = getPrismaPool();
				const updated = await prisma.daily.update({
					where: {
						id: id,
					},
					data: {
						lastCompleted: new Date(),
					},
					include: {
						class: true,
					},
				});
				return updated;
			} catch (error: any) {
				console.error(error);
				throw new Error("Could not complete daily task");
			}
		},
	})

	.mutation("uncomplete", {
		input: z.string().min(1),
		resolve: async ({ ctx, input: id }) => {
			try {
				const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
				const prisma = getPrismaPool();
				const updated = await prisma.daily.update({
					where: {
						id: id,
					},
					data: {
						lastCompleted: oneWeekAgo,
					},
					include: {
						class: true,
					},
				});
				return updated;
			} catch {
				throw new Error("Could not uncomplete daily task");
			}
		},
	})

	.query("on-dates", {
		input: z.number().array(),
		resolve: async ({ ctx, input }) => {
			try {
				const prisma = getPrismaPool();
				const dailies = await prisma.daily.findMany({
					where: {
						user: {
							id: ctx.user.id,
						},
						days: {
							hasSome: input,
						},
					},
					include: {
						class: true,
					},
					orderBy: {
						lastCompleted: "asc",
					},
				});
				return dailies;
			} catch {
				throw new Error("Could not get daily tasks");
			}
		},
	})

	.mutation("delete", {
		input: z.string(),
		resolve: async ({ ctx, input: id }) => {
			const prisma = getPrismaPool();
			const deleted = await prisma.daily.deleteMany({
				where: {
					id: id,
					userId: ctx.user.id,
				},
			});
		},
	})

	.mutation("edit", {
		input: z.object({
			id: z.string().min(1),
			title: z.string().min(1).max(50),
			days: z.number().array().min(1).max(7),
			classId: z.string().min(1).nullable(),
		}),
		resolve: async ({ ctx, input }) => {
			const prisma = getPrismaPool();
			try {
				let classDoc = input.classId
					? {
							connect: {
								id: input.classId,
							},
					  }
					: undefined;
				const updated = await prisma.daily.update({
					where: {
						id: input.id,
					},
					data: {
						class: classDoc,
						title: input.title,
						days: input.days,
					},
					include: {
						class: true,
					},
				});

				return updated;
			} catch (error) {
				throw new Error("Could not edit daily task");
			}
		},
	});
