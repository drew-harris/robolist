import * as trpc from "@trpc/server";
import superjson from "superjson"
import { createRouter } from "../server/context"
export const appRouter =
  createRouter()
    .transformer(superjson)
    .query("helloworld", {
      resolve: ({ ctx }) => {
        return {
          greeting: `Whats up, ${ctx.user?.email || "world"}!`,
          date: new Date(),
          dogName: "Fido"
        }
      }
    })

export type AppRouter = typeof appRouter;