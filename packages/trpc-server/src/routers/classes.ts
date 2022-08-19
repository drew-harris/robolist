import { Class, Prisma } from "@prisma/client";
import superjson from "superjson";
import { colorChoices } from "types";
import { z } from "zod";
import { createRouter } from "../server/context";
import { getPrismaPool } from "../utils";
export const classes = createRouter()
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
				const classes = await prisma.class.findMany({
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
		}),
		resolve: async ({ ctx, input }) => {
			if (!colorChoices.includes(input.color)) {
				throw new Error("Invalid color");
			}

			try {
				const prisma = getPrismaPool();

				const currentClass = await prisma.class.findFirst({
					where: {
						userId: ctx.user.id,
						name: input.name,
					},
				});

				if (currentClass) {
					// Throw
					throw new Error("You already have a class with the same name");
				}

				const createDoc: Prisma.ClassCreateInput = {
					user: {
						connect: { id: ctx.user.id },
					},
					color: input.color,
					name: input.name,
				};

				const createdClass: Class = await prisma.class.create({
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
				const prisma = getPrismaPool();
				await prisma.class.delete({
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
		}),
		resolve: async ({ ctx, input }) => {
			if (input.color && !colorChoices.includes(input.color)) {
				throw new Error("Invalid color");
			}

			try {
				const prisma = getPrismaPool();
				await prisma.class.update({
					where: {
						id: input.id,
					},
					data: {
						name: input.name,
						color: input.color,
					},
				});
			} catch (err) {
				throw new Error("Error editing class");
			}
		},
	});
