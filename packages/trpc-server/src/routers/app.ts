import superjson from "superjson";
import { createRouter } from "../server/context";
import { classes } from "./classes";
import { tasks } from "./tasks";
export const appRouter =
  createRouter()
    .transformer(superjson)
    .merge("tasks.", tasks)
    .merge("classes.", classes)

export type AppRouter = typeof appRouter;