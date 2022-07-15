import { NextApiRequest, NextApiResponse } from "next";
import type { APIError, APIRegisterResponse } from "types/api"
import * as EmailValidator from "email-validator"
import * as bcrypt from "bcrypt"
import * as JWT from "jsonwebtoken"
import { Prisma, PrismaClient, User } from "@prisma/client";
import { UserWithoutPassword } from "types";
import { setCookie } from "cookies-next";

const PASSWORD_MIN_LENGTH = 5;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIRegisterResponse>
) {
  if (req?.method != "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  // Signup starts here
  const body: Prisma.UserCreateInput = req.body;

  if (!body.name || !body.email || !body.password) {
    return res.status(400).json({ error: { message: "Missing field" } });
  }

  body.email = body.email.trim().toLowerCase();
  body.name = body.name.trim();
  body.password = body.password.trim();

  // Validate email
  if (!EmailValidator.validate(req.body.email)) {
    return res.status(400).json({ error: { message: "Invalid Email" } });
  }

  // Validate password
  if (body.password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ error: { message: "Password must be 6 characters or longer" } });
  }

  // Check if user with that email already exists
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    })

    if (users) {
      return res.status(400).json({ error: { message: "A user with that email already exists" } });
    }
  } catch (error: any) {
    return res.status(400).json({ error: { message: "Internal Error", error: error.message } });
  }

  // Encrypt password
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(body.password, salt);

  // Save to database
  let user: User;
  try {
    user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashed
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: { message: "Could not save new user to database", error: error.message } })
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

  const date = new Date()
  date.setDate(date.getDate() + 7)

  setCookie("jwt", jwt, {
    expires: date,
    req,
    res,
  })


  // Return jwt
  res.status(200).json({
    jwt: jwt
  });
}
