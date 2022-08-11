import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { UserWithoutPassword } from "types";
export function getUserFromJWT(
	token: string | undefined
): UserWithoutPassword | null {
	try {
		const secret = process.env.JWT_SECRET;
		if (!token || !secret) {
			console.log("NO TOKEN");
			return null;
		}
		const payload = jwt.verify(token, secret) as jwt.JwtPayload;
		return {
			email: payload.email,
			id: payload.id,
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}
let prisma: any = null;

export function getPrismaPool(): PrismaClient {
	if (prisma != null) {
		return prisma;
	} else {
		prisma = new PrismaClient();
		return prisma;
	}
}
