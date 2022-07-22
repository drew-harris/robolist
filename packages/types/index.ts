import type { Class, Task, User } from "@prisma/client";
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

export type TaskWithClass = Task & {
  class: Class | null;
};
