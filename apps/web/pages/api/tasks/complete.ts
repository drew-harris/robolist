import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { TaskWithClass } from "types";
import { getPrismaPool } from "../../../serverapi/prismapool";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req?.method != "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const jwt = getCookie("jwt", { req, res });
  const user = getUserFromJWT(jwt?.toString());
  if (!user) {
    res.status(401).json(unauthorizedResponse);
  }

  const body = req.body;
  if (!body.id || !body.hasOwnProperty("complete")) {
    return res
      .status(400)
      .json({ error: { message: "Missing id or complete" } });
  }

  try {
    const prisma = getPrismaPool();
    const task: TaskWithClass = await prisma.task.update({
      where: { id: body.id },
      data: {
        complete: body.complete,
      },
      include: {
        class: true,
      },
    });
    res.json({ task });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ error: { message: "Internal server error" } });
  }
  // Begins here
}
