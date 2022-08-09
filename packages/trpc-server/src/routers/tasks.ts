import superjson from "superjson";
import { createRouter } from "../server/context";
import { getPrismaPool } from "../utils";

export const tasks = createRouter()
  .transformer(superjson)
  .middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new Error("Unauthorized")
    }
    return next({ ctx: { user: ctx.user } })
  })
  .query("all", {
    resolve: async ({ ctx }) => {

      const prisma = getPrismaPool();
      const tasks = prisma.task.findMany({
        where: {
          user: {
            id: ctx.user.id,
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


  .query("today", {
    resolve: async ({ ctx }) => {
      try {
        const today = new Date();
        const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

        const prisma = getPrismaPool();
        const tasks = await prisma.task.findMany({
          where: {
            OR: [
              {
                workDate: {
                  lte: today,
                  gte: twentyFourHoursAgo,
                },
              },
              {
                workDate: {
                  lte: today,
                },
                complete: false,
              },
              {
                dueDate: {
                  lte: today,
                },
                complete: false,
              },
            ],
            AND: [
              {
                userId: ctx.user.id,
              },
            ],
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
      } catch (error) {
        console.error(error);
        throw new Error("Error getting tasks");
      }
    }
  })