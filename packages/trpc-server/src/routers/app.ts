import superjson from "superjson";
import { createRouter } from "../server/context";
import { classes } from "./classes";
import { daily } from "./daily";
import { tasks } from "./tasks";
export const appRouter = createRouter()
	.transformer(superjson)
	.merge("tasks.", tasks)
	.merge("classes.", classes)
	.merge("daily.", daily);

export type AppRouter = typeof appRouter;
