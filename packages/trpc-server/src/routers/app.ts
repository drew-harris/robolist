import { ColorScheme } from "@mantine/core";
import superjson from "superjson";
import { Settings } from "types";
import { createRouter } from "../server/context";
import { classes } from "./classes";
import { daily } from "./daily";
import { tasks } from "./tasks";
import { feedback } from "./feedback";
import { canvas } from "./canvas";
export const appRouter = createRouter()
	.transformer(superjson)
	.merge("tasks.", tasks)
	.merge("classes.", classes)
	.merge("daily.", daily)
	.merge("feedback.", feedback)
	.merge("canvas.", canvas)
	.query("theme-and-settings", {
		resolve: (ctx) => {
			let settings: Partial<Settings> | null = null;
			if (ctx.ctx.settings) {
				settings = JSON.parse(ctx.ctx.settings) as Partial<Settings>;
			}
			return {
				theme: ctx.ctx.theme as ColorScheme | null,
				settings,
				user: ctx.ctx.user,
			};
		},
	});

export type AppRouter = typeof appRouter;
