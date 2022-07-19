import { Prisma } from "@prisma/client";
import type { Class } from "@prisma/client";
import { ClassNames } from "@emotion/react";

export interface APIRegisterResponse {
  error?: APIError;
  jwt?: string;
}

export interface APILoginRequest {
  email: string;
  password: string;
}

export interface APIError {
  message: string;
  error?: string;
}

export type APIClassCreate = Pick<Class, "color" | "name">;

export interface APICreateClassResponse {
  error?: APIError;
  class?: Class;
}
