import type { User } from "canvas-api-ts/dist/api/responseTypes";
import * as JWT from "jsonwebtoken";
import z from "zod";
import { createRouter } from "../server/context";

export const canvasInfo = createRouter()
	.middleware(({ ctx, next }) => {
		if (!ctx.user) {
			throw new Error("Unauthorized");
		}
		return next({ ctx: { user: ctx.user, prisma: ctx.prisma } });
	})
	.mutation("account-update", {
		resolve: async ({ ctx }) => {
			// Pull up the user record and compare to the JWT
			try {
				const user = await ctx.prisma.user.findFirst({
					where: {
						id: ctx.user.id,
					},
					include: {
						canvasAccount: true,
					},
				});

				if (!user) {
					throw new Error("Unauthorized");
				}

				if (
					(user.canvasAccount && !ctx.user.canvasAccount) ||
					(!user.canvasAccount && ctx.user.canvasAccount)
				) {
					// Create a new jwt and send it back
					let jwt: string;
					const { password, ...rest } = user;
					const payload = rest;

					const secret: JWT.Secret | undefined = process.env.JWT_SECRET;
					if (!secret) {
						throw new Error("JWT_SECRET is not set");
					}

					jwt = JWT.sign(payload, secret, {
						expiresIn: "14d",
					});

					return jwt;
				}

				return null;
			} catch (error: unknown) {
				if (error instanceof Error) {
					throw error;
				} else {
					throw new Error("Failed to get account information");
				}
			}
		},
	})
	.mutation("verify-info", {
		input: z.object({
			url: z.string().url(),
			token: z.string(),
		}),
		resolve: async ({ input, ctx }) => {
			// Test if url and token work
			let user: User;
			try {
				const fullUrl = input.url + "/api/v1/users/self";
				const res = await fetch(fullUrl, {
					headers: {
						Authorization: "Bearer " + input.token,
					},
				});

				user = await res.json();
				if (!res.ok) {
					throw new Error("Invalid token");
				}
			} catch (error) {
				throw new Error("Could not verify token");
			}
			try {
				const newUser = await ctx.prisma.user.update({
					data: {
						canvasAccount: {
							upsert: {
								create: {
									id: user.id,
									name: user.name,
									token: input.token,
									url: input.url,
								},
								update: {
									id: user.id,
									name: user.name,
									token: input.token,
									url: input.url,
								},
							},
						},
					},
					where: {
						id: ctx.user.id,
					},
					include: {
						canvasAccount: true,
					},
				});
				let jwt: string;
				const { password, ...rest } = newUser;
				const payload = rest;

				const secret: JWT.Secret | undefined = process.env.JWT_SECRET;
				if (!secret) {
					throw new Error("JWT_SECRET is not set");
				}

				jwt = JWT.sign(payload, secret, {
					expiresIn: "14d",
				});
				return { jwt: jwt, success: true, account: newUser.canvasAccount };
			} catch (error) {
				throw new Error("Could not update records");
			}
		},
	})
	.mutation("disconnect-account", {
		resolve: async ({ ctx }) => {
			try {
				const newUser = await ctx.prisma.user.update({
					where: {
						id: ctx.user.id,
					},
					data: {
						canvasAccount: {
							delete: true,
						},
					},
					include: {
						canvasAccount: true,
					},
				});

				await ctx.prisma.class.updateMany({
					where: {
						userId: ctx.user.id,
					},
					data: {
						canvasId: null,
						canvasName: null,
						canvasUUID: null,
					},
				});

				let jwt: string;
				const { password, ...rest } = newUser;
				const payload = rest;

				const secret: JWT.Secret | undefined = process.env.JWT_SECRET;
				if (!secret) {
					throw new Error("JWT_SECRET is not set");
				}
				jwt = JWT.sign(payload, secret, {
					expiresIn: "14d",
				});
				return { jwt: jwt, success: true, account: newUser.canvasAccount };
			} catch (error) {
				console.error(error);
				throw new Error("Could not update records");
			}
		},
	});
