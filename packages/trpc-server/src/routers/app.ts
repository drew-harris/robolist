import { ColorScheme } from "@mantine/core";
import superjson from "superjson";
import { createRouter } from "../server/context";
import { classes } from "./classes";
import { daily } from "./daily";
import { tasks } from "./tasks";
export const appRouter = createRouter()
	.transformer(superjson)
	.merge("tasks.", tasks)
	.merge("classes.", classes)
	.merge("daily.", daily)
	.query("theme", {
		resolve: (ctx) => {
			console.log("returning theme: ", ctx.ctx.theme);
			return ctx.ctx.theme as ColorScheme | undefined;
		},
	});

export type AppRouter = typeof appRouter;
