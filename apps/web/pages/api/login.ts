import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { APILoginRequest, APIRegisterResponse } from "types/api";
import * as bcrypt from "bcrypt"
import * as JWT from "jsonwebtoken"
import { UserWithoutPassword } from "types";
import { setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIRegisterResponse>
) {
  if (req?.method != "POST") {
    return res.status(405).json({ error: { message: "This method is not available" } });
  }

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: { message: "Missing field" } });
  }

  const body: APILoginRequest = req.body;

  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    })

    if (!user) {
      return res.status(400).json({ error: { message: "Email or password is incorrect" } })
    }

    const match = await bcrypt.compare(body.password, user.password)
    if (!match) {
      return res.status(400).json({ error: { message: "Email or password is incorrect" } })
    }

    // Sign jwt
    let jwt: string
    try {
      const payload: UserWithoutPassword = {
        name: user.email,
        email: user.email,
        id: user.id,
      }

      const secret: JWT.Secret | undefined = process.env.JWT_SECRET
      if (!secret) {
        return res.status(500).json({ error: { message: "Could not load secret to sign credentials" } })
      }
      jwt = JWT.sign(payload, secret)

    } catch (error: any) {
      return res.status(500).json({ error: { message: "Could not sign credentials", error: error.message } })
    }

    // Date 1 week from now
    const date = new Date()
    date.setDate(date.getDate() + 7)

    setCookie("jwt", jwt, {
      expires: date,
      req,
      res
    })

    return res.status(200).json({
      jwt: jwt
    });

  } catch (error) {
    return res.status(500).json({ error: { message: "Internal Server Error" } });
  }
}
