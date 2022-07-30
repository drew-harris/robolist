import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import {
  APIGetTasksResponse,
  APISingleTaskResponse,
  UserWithoutPassword,
} from "types";
import { getTaskByDate } from "../../../serverapi/tasks";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils";

async function taskByDate(
  req: NextApiRequest,
  res: NextApiResponse<APIGetTasksResponse>,
  user: UserWithoutPassword
) {
  try {
    const { date: dateString } = req.query;
    if (typeof dateString !== "string") {
      return res.status(400).json({ error: { message: "Invalid date" } });
    }
    const date = new Date(dateString);
    const tasks = await getTaskByDate(date, user.id);
    return res.json({ tasks });
  } catch (error: any) {
    log.error("user tried to get a task", { error: error.message });
    return res
      .status(500)
      .json({ error: { message: "Internal server error" } });
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APISingleTaskResponse>
) {
  if (req?.method != "GET") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }
  const jwt = getCookie("jwt", { req, res });
  const user = getUserFromJWT(jwt?.toString());

  if (!user) {
    return res.status(401).json(unauthorizedResponse);
  }

  // Switch methods
  switch (req.method) {
    case "GET":
      return taskByDate(req, res, user);
    default:
      return res.status(405).json({ error: { message: "Method not allowed" } });
  }
}

export default withAxiom(handler);
