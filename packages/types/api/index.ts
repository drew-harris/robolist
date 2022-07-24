import { Prisma, Task } from "@prisma/client";
import type { Class } from "@prisma/client";
import { ClassNames } from "@emotion/react";
import { DateAggregation, TaskWithClass } from "..";

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

export interface APIGetClassesResponse {
  error?: APIError;
  classes?: Class[];
}

export interface APICreateTaskResponse {
  error?: APIError;
  task?: Task;
}

export interface APIGetTasksResponse {
  tasks?: TaskWithClass[];
  error?: APIError;
}

export interface APINewTaskRequest {
  dueDate: Date | null;
  workDate: Date | null;
  title: string;
  classId: string | null;
  description?: string | null;
  workTime?: number | null;
}

export interface APIDateAggregationResponse {
  error?: APIError;
  dates?: DateAggregation[];
}
