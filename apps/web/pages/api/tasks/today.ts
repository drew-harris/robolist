import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { UserWithoutPassword } from "types";
import { getTodayTasksFromId } from "../../../serverapi/tasks";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils";

async function getTodayTasks(
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserWithoutPassword
) {
  try {
    const tasks = await getTodayTasksFromId(user.id);
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

  if (req.method == "GET") {
    return await getTodayTasks(req, res, user);
  } else {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }
}
