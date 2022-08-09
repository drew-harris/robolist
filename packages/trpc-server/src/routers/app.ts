import * as trpc from "@trpc/server";
import superjson from "superjson"
import { tasks } from "./tasks"
import { createRouter } from "../server/context"
export const appRouter =
  createRouter()
    .transformer(superjson)
    .merge("tasks.", tasks)

export type AppRouter = typeof appRouter;