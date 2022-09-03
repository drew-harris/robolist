import { Assignment, Course } from "canvas-api-ts/dist/api/responseTypes";
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
	})

	.query("list-upcoming", {
		input: z.object({
			excludeAdded: z.boolean().default(false),
		}),
		resolve: async ({ ctx, input }) => {
			try {
				const responsePromise = fetch(
					`${ctx.canvas.url}/api/v1/users/self/upcoming_events`,
					{
						headers: {
							Authorization: `Bearer ${ctx.canvas.token}`,
						},
					}
				);

				if (!input.excludeAdded) {
					const response = await responsePromise;
					const data: any[] = await response.json();
					return data.map((calEvent) => calEvent.assignment) as Assignment[];
				}

				const tasksPromise = ctx.prisma.task.findMany({
					where: {
						NOT: [{ canvasId: null }],
						userId: ctx.user.id,
					},
				});

				const [response, tasks] = await Promise.all([
					responsePromise,
					tasksPromise,
				]);

				const data: any[] = await response.json();
				const assignments = data.map(
					(calEvent) => calEvent.assignment
				) as Assignment[];
				return assignments.filter((assignment) => {
					if (tasks.find((task) => task.canvasId === assignment.id)) {
						return false;
					}
					return true;
				});
			} catch (error: unknown) {
				if (error instanceof Error) {
					throw Error;
				}
				throw new Error("Failed to get upcoming assignments");
			}
		},
	})
	.mutation("link-task", {
		input: z.object({
			taskId: z.string(),
			courseId: z.number(),
			canvasId: z.number(),
		}),
		resolve: async ({ ctx, input }) => {
			try {
				console.log("Linking task");
				const response = await fetch(
					`${ctx.canvas.url}/api/v1/courses/${input.courseId}/assignments/${input.canvasId}`,
					{
						headers: {
							Authorization: `Bearer ${ctx.canvas.token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch assignment");
				}

				const assignment = (await response.json()) as Assignment;

				const task = await ctx.prisma.task.update({
					where: {
						id: input.taskId,
					},
					data: {
						canvasDescription: assignment.description || null,
						canvasId: input.canvasId,
						canvasName: assignment.name || null,
						canvasURL: assignment.html_url || null,
					},
					include: {
						class: true,
					},
				});

				return task;
			} catch (error: unknown) {
				if (error instanceof Error) {
					throw Error;
				}
				throw new Error("Failed to link task");
			}
		},
	})

	.query("list-course-assignments", {
		input: z.object({
			courseId: z.number().nullable(),
			excludeLinked: z.boolean().default(false),
		}),
		resolve: async ({ ctx, input }) => {
			console.log("Listing course assignments");
			if (!input.courseId) {
				throw new Error("No course id provided");
			}
			const responsePromise = fetch(
				`${ctx.canvas.url}/api/v1/users/self/courses/${input.courseId}/assignments?order=due_at&bucket=upcoming`,
				{
					headers: {
						Authorization: `Bearer ${ctx.canvas.token}`,
					},
				}
			);

			if (!input.excludeLinked) {
				const response = await responsePromise;
				if (!response.ok) {
					throw new Error("Failed to fetch assignments");
				}
				const assignments = (await response.json()) as Assignment[];

				return assignments;
			}

			const tasksPromise = ctx.prisma.task.findMany({
				where: {
					NOT: [{ canvasId: null }],
					userId: ctx.user.id,
					class: {
						canvasId: input.courseId,
					},
				},
				include: {
					class: true,
				},
			});

			const [response, tasks] = await Promise.all([
				responsePromise,
				tasksPromise,
			]);

			if (!response.ok) {
				throw new Error("Failed to fetch assignments");
			}

			const assignments = (await response.json()) as Assignment[];

			return assignments.filter((assignment) => {
				if (tasks.find((task) => task.canvasId === assignment.id)) {
					return false;
				}
				return true;
			});
		},
	});
