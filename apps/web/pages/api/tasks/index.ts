import { Prisma, PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import {
  APICreateTaskResponse,
  APINewTaskRequest,
  UserWithoutPassword,
} from "types";
import { getTasksFromId } from "../../../serverapi/tasks";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils";

async function createTask(
  req: NextApiRequest,
  res: NextApiResponse<APICreateTaskResponse>,
  user: UserWithoutPassword
) {
  const data: APINewTaskRequest = req.body;
  console.log(data);
  if (!data.title || !data.workDate || !data.dueDate) {
    return res.status(400).json({ error: { message: "Missing field" } });
  }

  try {
    const prisma = new PrismaClient();

    const classDoc = data.classId
      ? {
          connect: {
            id: data.classId,
          },
        }
      : undefined;

    const doc: Prisma.TaskCreateInput = {
      dueDate: data.dueDate,
      title: data.title,
      user: {
        connect: {
          id: user.id,
        },
      },
      workDate: data.workDate,
      class: classDoc,
      complete: false,
      description: data.description,
      workTime: null,
    };

    const task = await prisma.task.create({
      data: doc,
    });

    return res.json({ task });
  } catch (error: any) {
    return res.status(500).json({
      error: { message: "Internal Server Error", error: error.message },
    });
  }
}

async function getTasks(
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserWithoutPassword
) {
  try {
    const tasks = await getTasksFromId(user.id);
    return res.json({
      tasks,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(405).json({
      error: { message: "Internal Server Error", error: error.message },
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jwt = getCookie("jwt", { req, res });
  const user = getUserFromJWT(jwt?.toString());

  if (!user) {
    return res.status(401).json(unauthorizedResponse);
  }

  if (req.method == "POST") {
    return await createTask(req, res, user);
  } else if (req.method == "GET") {
    return await getTasks(req, res, user);
  } else {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }
}
