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

export function dateIsToday(date: Date): boolean {
  const today = new Date();
  try {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    return false;
  }
}

export function getHumanDateString(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateIsToday(date)) {
    return "Today";
  }
  if (date.getDate() === today.getDate() - 1) {
    return "Yesterday";
  }

  // Tomorrow
  if (date.getDate() === today.getDate() + 1) {
    return "Tomorrow";
  }

  // If date in next 5 days, show day of week
  if (date.getTime() < today.getTime() + 5 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
