import { createRouter } from "../server/context"
import superjson from "superjson"
import { PrismaClient } from "@prisma/client";
export const tasks = createRouter()
  .transformer(superjson)
  .query("all-tasks", {
    resolve: async ({ ctx }) => {
      if (!ctx.user) {
        throw new Error("Unauthorized")
      }
      const prisma = new PrismaClient();
      const tasks = prisma.task.findMany({
        where: {
          user: {
            id: ctx?.user?.id,
          },
        },
        orderBy: [
          {
            workDate: "asc",
          },
          {
            complete: "asc",
          },
          {
            updatedAt: "desc",
          },
        ],
        include: {
          class: true,
        },
      });

      return tasks;
    }
  })
