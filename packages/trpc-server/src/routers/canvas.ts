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
				const responsePromise = fetch(
					`${ctx.canvas.url}/api/v1/users/self/courses?enrollment_state=active`,
					{
						headers: {
							Authorization: `Bearer ${ctx.canvas.token}`,
						},
					}
				);

				// Get connected classes
				const classesPromise = ctx.prisma.class.findMany({
					where: {
						userId: ctx.user.id,
						NOT: {
							canvasId: null,
						},
					},
				});

				if (!input.excludeConnected) {
					const response = await responsePromise;

					if (!response.ok) {
						console.log(response);
						throw new Error("Failed to fetch classes");
					}

					return (await response.json()) as Course[];
				}

				const [response, classes] = await Promise.all([
					responsePromise,
					classesPromise,
				]);

				if (!response.ok) {
					console.log(response);
					throw new Error("Failed to fetch classes");
				}

				const allCourses = (await response.json()) as Course[];

				const courses = allCourses.filter((course) => {
					if (
						classes.filter((_class) => _class.canvasId == course.id).length == 0
					)
						return true;
				});
				return courses;
			} catch (error) {
				console.error(error);
				throw new Error("Could not fetch courses");
			}
		},
	});
