import { Course } from "canvas-api-ts/dist/api/responseTypes";
import { z } from "zod";
import { createRouter } from "../server/context";
export const canvas = createRouter()
	.middleware(({ ctx, next }) => {
		if (!ctx.user) {
			throw new Error("Unauthorized");
		}
		if (!ctx.user.canvasAccount) {
			throw new Error("No Canvas account linked");
		}
		return next({
			ctx: {
				user: ctx.user,
				prisma: ctx.prisma,
				canvas: ctx.user.canvasAccount,
			},
		});
	})
	.query("courses", {
		input: z.object({
			excludeConnected: z.boolean().optional().default(false),
		}),
		resolve: async ({ ctx, input }) => {
			try {
				console.log("feching classes");
				const response = await fetch(
					`${ctx.canvas.url}/api/v1/users/self/courses?enrollment_state=active`,
					{
						headers: {
							Authorization: `Bearer ${ctx.canvas.token}`,
						},
					}
				);

				if (!response.ok) {
					console.log(response);
					throw new Error("Failed to fetch classes");
				}

				const courses = (await response.json()) as Course[];
				return courses;
			} catch (error) {
				console.error(error);
				throw new Error("Could not fetch courses");
			}
		},
	})
	.mutation("link-class", {
		input: z.object({
			classId: z.string(),
			canvasClassId: z.number(),
		}),
		resolve: async ({ ctx, input }) => {
			try {
				// Verify that the user has that class
				const response = await fetch(
					`${ctx.canvas.url}/api/v1/courses/${input.canvasClassId}`,
					{
						headers: {
							Authorization: "Bearer " + ctx.canvas.token,
						},
					}
				);

				if (!response.ok) {
					throw new Error("You do not belong to this class");
				}

				const data = (await response.json()) as Course;

				const newClass = await ctx.prisma.class.update({
					where: {
						id: input.classId,
					},
					data: {
						canvasId: input.canvasClassId,
						canvasName: data.course_code || data.name,
						canvasUUID: data.uuid,
					},
				});

				return newClass;
			} catch (error) {
				throw new Error("There was an error linking your class");
			}
		},
	});
