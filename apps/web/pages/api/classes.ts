import { Class, Prisma, PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { APIClassCreate, APICreateClassResponse, colorChoices } from "types";
import { getUserFromJWT, unauthorizedResponse } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APICreateClassResponse>
) {
  if (req?.method != "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }
  const jwt = getCookie("jwt", { req, res });
  const user = getUserFromJWT(jwt?.toString());

  if (!user) {
    return res.status(401).json(unauthorizedResponse);
  }

  const data: APIClassCreate = req.body;
  if (!data.color || !data.name) {
    return res.status(400).json({ error: { message: "Missing field" } });
  }

  if (!colorChoices.includes(data.color)) {
    return res
      .status(400)
      .json({ error: { message: "That color is not an option" } });
  }

  try {
    const prisma = new PrismaClient();

    const currentClass = await prisma.class.findFirst({
      where: {
        userId: user.id,
        name: data.name,
      },
    });

    if (currentClass) {
      return res.json({
        error: { message: "You already have a class with the same name" },
      });
    }

    const createDoc: Prisma.ClassCreateInput = {
      user: {
        connect: { id: user.id },
      },
      color: data.color,
      name: data.name,
    };

    const createdClass: Class = await prisma.class.create({
      data: createDoc,
    });

    // Begins here
    return res.json({ class: createdClass });
  } catch (error: any) {
    return res.json({
      error: {
        error: error.message || "unknown error",
        message: "Error saving to database",
      },
    });
  }
}
