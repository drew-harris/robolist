import { NextApiRequest, NextApiResponse } from "next";
import type { APIError, APIRegisterResponse } from "types/api"
import * as EmailValidator from "email-validator"
import * as bcrypt from "bcrypt"
import * as JWT from "jsonwebtoken"
import { Prisma, PrismaClient, User } from "@prisma/client";
import { UserWithoutPassword } from "types";

const PASSWORD_MIN_LENGTH = 5;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIRegisterResponse>
) {
  if (req?.method != "POST") {
    res.status(405).json({ error: { message: "Method not allowed" }, jwt: null });
    return;
  }

  // Signup starts here
  const body: Prisma.UserCreateInput = req.body;

  if (!body.name || !body.email || !body.password) {
    res.status(400).json({ error: { message: "Missing field" }, jwt: null });
    return;
  }

  body.email = body.email.trim().toLowerCase();
  body.name = body.name.trim();
  body.password = body.password.trim();

  // Validate email
  if (!EmailValidator.validate(req.body.email)) {
    res.status(400).json({ error: { message: "Invalid Email" } });
    return;
  }

  // Validate password
  if (body.password.length < PASSWORD_MIN_LENGTH) {
    res.status(400).json({ error: { message: "Password must be 6 characters or longer" } });
    return;
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
      res.status(400).json({ error: { message: "A user with that email already exists" } });
      return;
    }
  } catch (error: any) {
    res.status(400).json({ error: { message: "Internal Error", error: error.message } });
    return;
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
    res.status(500).json({ error: { message: "Could not save new user to database", error: error.message } })
    return;
  }

  // Sign jwt
  let jwt: String
  try {
    const payload: UserWithoutPassword = {
      name: user.email,
      email: user.email,
      id: user.id,
    }

    const secret: JWT.Secret | undefined = process.env.JWT_SECRET
    if (!secret) {
      res.status(500).json({ error: { message: "Could not load secret to sign credentials" } })
      return
    }
    jwt = JWT.sign(payload, secret)

  } catch (error: any) {
    res.status(500).json({ error: { message: "Could not sign credentials", error: error.message } })
    return
  }

  // Return jwt
  res.status(200).json({
    jwt: jwt
  });
}
