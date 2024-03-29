import * as jwt from "jsonwebtoken";
import { APIError, UserWithoutPassword } from "types";

export function getUserFromJWT(
	token: string | undefined
): UserWithoutPassword | null {
	try {
		const secret = process.env.JWT_SECRET;

		if (!token || !secret) {
			return null;
		}

		const payload = jwt.verify(token, secret) as jwt.JwtPayload;

		return {
			email: payload.email,
			id: payload.id,
		};
	} catch (error) {
		return null;
	}
}

export const unauthorizedResponse = {
	error: {
		message: "Unauthorized",
	} as APIError,
};
