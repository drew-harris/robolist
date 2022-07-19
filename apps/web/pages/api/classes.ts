import { Class, Prisma, PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import {
  APIClassCreate,
  APICreateClassResponse,
  APIGetClassesResponse,
  colorChoices,
  UserWithoutPassword,
} from "types";
import { getClassesFromId } from "../../serverapi/classes";
import { getUserFromJWT, unauthorizedResponse } from "../../utils";

async function createClass(
  req: NextApiRequest,
  res: NextApiResponse<APICreateClassResponse>,
  user: UserWithoutPassword
) {
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

async function getClasses(
  req: NextApiRequest,
  res: NextApiResponse<APIGetClassesResponse>,
  user: UserWithoutPassword
) {
  try {
    const classes = await getClassesFromId(user.id);
    return res.json({
      classes: classes,
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
    return await createClass(req, res, user);
  } else if (req.method == "GET") {
    return await getClasses(req, res, user);
  } else {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }
}
