import type { Class, Daily, Task, User } from "@prisma/client";
export type UserWithoutPassword = Omit<User, "password">;

export * from "./api";
export * from "./focus";
export * from "./settings";

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
	_sum: { workTime: number | null };
	workDate: Date;
	simpleTasksCount: number;
	totalWorkTime: number;
}
export interface RescheduleInput {
	task: TaskWithClass;
	date: Date;
}

export type TDemoTask = Pick<
	TaskWithClass,
	"id" | "title" | "workDate" | "workTime" | "class" | "complete"
>;

export type DailyWithClass = Daily & {
	class: Class | null;
};
