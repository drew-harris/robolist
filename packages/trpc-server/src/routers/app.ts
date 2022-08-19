import { ColorScheme } from "@mantine/core";
import superjson from "superjson";
import { Settings } from "types";
import { createRouter } from "../server/context";
import { classes } from "./classes";
import { daily } from "./daily";
import { tasks } from "./tasks";
import { feedback } from "./feedback";
export const appRouter = createRouter()
	.transformer(superjson)
	.merge("tasks.", tasks)
	.merge("classes.", classes)
	.merge("daily.", daily)
	.merge("feedback.", feedback)
	.query("theme-and-settings", {
		resolve: (ctx) => {
			let settings: Partial<Settings> | null = null;
			if (ctx.ctx.settings) {
				settings = JSON.parse(ctx.ctx.settings) as Partial<Settings>;
			}
			return {
				theme: ctx.ctx.theme as ColorScheme | null,
				settings,
			};
		},
	});

export type AppRouter = typeof appRouter;
