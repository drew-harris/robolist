import { APIError, UserWithoutPassword } from "types";
import * as jwt from "jsonwebtoken";
import tinygradient from "tinygradient";

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

export function getHeatmapColor(index: number) {
  if (index < 0 || index > 1) {
    return "#ffffff";
  }
  const gradient = tinygradient("green", "red");
  const colorhsv = gradient.rgbAt(index);
  return "#" + colorhsv.toHex();
}
