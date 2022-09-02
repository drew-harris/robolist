import { Class, Prisma } from "@prisma/client";
import { Course } from "canvas-api-ts/dist/api/responseTypes";
import superjson from "superjson";
import { colorChoices } from "types";
import { z } from "zod";
import { dateIsToday } from "../../../../apps/web/utils/client";
import { createRouter } from "../server/context";
export const classes = createRouter()
	.transformer(superjson)

	.middleware(({ ctx, next }) => {
		if (!ctx.user) {
			throw new Error("Unauthorized");
		}
		return next({ ctx: { user: ctx.user, prisma: ctx.prisma } });
	})

	.query("all", {
		resolve: async ({ ctx }) => {
			try {
				const classes = await ctx.prisma.class.findMany({
					where: {
						userId: ctx.user.id,
					},
					orderBy: [
						{
							createdAt: "desc",
						},
						{
							id: "desc",
						},
					],
				});
				return classes;
			} catch (error) {
				console.error(error);
				throw new Error("Error getting classes");
			}
		},
	})

	.mutation("create", {
		input: z.object({
			color: z.string(),
			name: z.string(),
			canvasClassId: z.number().nullable().default(null),
		}),
		resolve: async ({ ctx, input }) => {
			if (!colorChoices.includes(input.color)) {
				throw new Error("Invalid color");
			}

			try {
				const currentClass = await ctx.prisma.class.findFirst({
					where: {
						userId: ctx.user.id,
						name: input.name,
					},
				});

				if (currentClass) {
					// Throw
					throw new Error("You already have a class with the same name");
				}

				// If canvas id included in input fetch class info
				let data: Course | null = null;
				const useCanvas: boolean =
					!!input.canvasClassId && !!ctx.user.canvasAccount;
				if (!!input.canvasClassId && !!ctx.user.canvasAccount) {
					const response = await fetch(
						`${ctx.user.canvasAccount.url}/api/v1/courses/${input.canvasClassId}`,
						{
							headers: {
								Authorization: "Bearer " + ctx.user.canvasAccount.token,
							},
						}
					);

					if (!response.ok) {
						throw new Error("You do not belong to this class");
					}
					data = (await response.json()) as Course;
				}

				const createDoc: Prisma.ClassCreateInput = {
					user: {
						connect: { id: ctx.user.id },
					},
					color: input.color,
					name: input.name,
					canvasId: input.canvasClassId,
					canvasName: data?.course_code || data?.name || null,
					canvasUUID: data?.uuid || null,
				};

				const createdClass = await ctx.prisma.class.create({
					data: createDoc,
				});

				return createdClass;
			} catch (error) {
				console.error(error);
				throw new Error("Error creating class");
			}
		},
	})

	.mutation("delete", {
		input: z.string(),
		resolve: async ({ ctx, input: id }) => {
			try {
				await ctx.prisma.class.delete({
					where: {
						id: id,
					},
				});
			} catch (error) {
				throw new Error("Error deleting class");
			}
		},
	})

	.mutation("edit", {
		input: z.object({
			id: z.string(),
			name: z.string().optional(),
			color: z.string().optional(),
			canvasClassId: z.number().nullable(),
		}),
		resolve: async ({ ctx, input }) => {
			if (input.color && !colorChoices.includes(input.color)) {
				throw new Error("Invalid color");
			}

			let data: Course | null = null;
			const useCanvas: boolean =
				!!input.canvasClassId && !!ctx.user.canvasAccount;
			if (!!input.canvasClassId && !!ctx.user.canvasAccount) {
				const response = await fetch(
					`${ctx.user.canvasAccount.url}/api/v1/courses/${input.canvasClassId}`,
					{
						headers: {
							Authorization: "Bearer " + ctx.user.canvasAccount.token,
						},
					}
				);

				if (!response.ok) {
					throw new Error("You do not belong to this class");
				}
				data = (await response.json()) as Course;
			}

			try {
				await ctx.prisma.class.update({
					where: {
						id: input.id,
					},
					data: {
						name: input.name,
						color: input.color,
						canvasId: input.canvasClassId,
						canvasName: data?.course_code || data?.name || null,
						canvasUUID: data?.uuid || null,
					},
				});
			} catch (err) {
				throw new Error("Error editing class");
			}
		},
	});
