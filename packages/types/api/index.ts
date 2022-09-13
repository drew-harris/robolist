import type { Class } from "@prisma/client";
import { Prisma, Task } from "@prisma/client";
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

export interface APICompleteRequest {
	id: string;
	complete: boolean;
	minutes?: number;
}

export interface APICompleteResponse {
	error?: APIError;
	task?: TaskWithClass;
}

export interface APISingleTaskResponse {
	error?: APIError;
	task?: TaskWithClass | null;
}

export interface APIRescheduleRequest {
	id: string;
	date: string | Date | Prisma.DateTimeFieldUpdateOperationsInput | undefined;
}

export interface APIRescheduleResponse {
	error?: APIError;
	task?: TaskWithClass;
}

export interface APITaskOrError {
	error?: APIError;
	task?: TaskWithClass;
}

export interface APISuccessOrError {
	error?: APIError;
	success: boolean;
}

export interface APITasksOrError {
	error?: APIError;
	tasks?: TaskWithClass[];
}
