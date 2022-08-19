import { z } from "zod";
import { createRouter } from "../server/context";
import { getPrismaPool } from "../utils";

export const feedback = createRouter()
	.middleware(({ ctx, next }) => {
		if (!ctx.user) {
			throw new Error("Unauthorized");
		}
		return next({ ctx: { user: ctx.user } });
	})
	.mutation("create", {
		input: z.string(),
		resolve: async ({ input, ctx }) => {
			if (input.length < 1) {
				throw new Error("Feedback is too short");
			}
			try {
				const prisma = getPrismaPool();
				await prisma.feedback.create({
					data: {
						text: input,
						user: {
							connect: {
								id: ctx.user.id,
							},
						},
					},
				});
				return true;
			} catch (error) {
				throw new Error("Could not send feedback");
			}
		},
	});
