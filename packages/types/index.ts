import type { User } from "@prisma/client";
export type UserWithoutPassword = Omit<User, "password">;

export * from "./api";
export const colorChoices: string[] = [
  "red",
  "pink",
  "grape",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "orange",
];
