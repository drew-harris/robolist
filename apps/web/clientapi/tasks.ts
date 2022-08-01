import { TaskWithClass } from "types";
import superjson from "superjson";

export async function getTasks(): Promise<TaskWithClass[]> {
	try {
		const data = await fetch("/api/tasks");
		// Parse with superjson
		const json = await data.json();
		if (json.error) {
			console.error(json.error);
			throw new Error(json.error.message);
		}
		return json.tasks.map((task: any) => {
			// Fix dates
			task.dueDate = new Date(task.dueDate);
			task.workDate = new Date(task.workDate);
			return task;
		});
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function getTodayTasks(): Promise<TaskWithClass[]> {
	try {
		const data = await fetch("/api/tasks/today");
		// Parse with superjson
		const json = await data.json();
		if (json.error) {
			console.error(json.error);
			throw new Error(json.error.message);
		}
		return json.tasks.map((task: any) => {
			// Fix dates
			task.dueDate = new Date(task.dueDate);
			task.workDate = new Date(task.workDate);
			return task;
		});
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function markTaskStatus(
	id: string,
	complete: boolean,
	minutes?: number
): Promise<TaskWithClass> {
	try {
		const data = await fetch(`/api/tasks/complete`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
				complete,
				minutes,
			}),
		});
		// Parse with superjson
		const json = await data.json();
		if (json.error) {
			console.error(json.error);
			throw new Error(json.error.message);
		}
		// Fix dates
		json.task.dueDate = new Date(json.task.dueDate);
		json.task.workDate = new Date(json.task.workDate);
		return json.task;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function deleteTask(id: string) {
	try {
		const data = await fetch(`/api/tasks/delete`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
			}),
		});
		// Parse with superjson
		const json = await data.json();
		if (json.error) {
			console.error(json.error);
			throw new Error(json.error.message);
		}
		// Fix dates
		return json.success;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function rescheduleTask(
	task: TaskWithClass,
	newDate: Date
): Promise<TaskWithClass> {
	try {
		const data = await fetch(`/api/tasks/reschedule`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: task.id,
				date: newDate,
			}),
		});

		const json = await data.json();
		if (json.error) {
			console.error(json.error);
			throw new Error(json.error.message);
		}
		// Fix dates
		json.task.dueDate = new Date(json.task.dueDate);
		json.task.workDate = new Date(json.task.workDate);
		return json.task;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function getTasksByDate(date: Date) {
	try {
		const data = await fetch(`/api/dates/${date.toISOString()}`);
		// Parse with superjson
		const json = await data.json();
		if (json.error) {
			console.error(json.error);
			throw new Error(json.error.message);
		}
		return json.tasks.map((task: any) => {
			// Fix dates
			task.dueDate = new Date(task.dueDate);
			task.workDate = new Date(task.workDate);
			return task;
		});
	} catch (error: any) {
		throw new Error(error.message);
	}
}
