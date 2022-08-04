import type { Class, Task, User } from "@prisma/client";
export type UserWithoutPassword = Omit<User, "password">;

export * from "./settings";
export * from "./api";
export * from "./focus";

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

export interface DateAggregation {
	_count: number;
	_sum: { workTime: number | null };
	workDate: Date;
}
export interface RescheduleInput {
	task: TaskWithClass;
	date: Date;
}

export type TDemoTask = Pick<
	TaskWithClass,
	"id" | "title" | "workDate" | "workTime" | "class" | "complete"
>;
