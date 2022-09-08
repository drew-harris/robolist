import {
	APISuccessOrError,
	APITaskOrError,
	APITasksOrError,
	TaskWithClass,
} from "types";

export async function getTodayTasks(): Promise<TaskWithClass[]> {
	try {
		const data = await fetch("/api/tasks/today");
		// Parse with superjson
		const json: APITasksOrError = await data.json();
		if (json.error || !json.tasks) {
			console.error(json.error);
			throw new Error(json?.error?.message || "Could not get tasks");
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
		const json: APITaskOrError = await data.json();
		if (json.error) {
			console.error(json.error);
			throw new Error(json.error.message);
		}
		if (!json.task) {
			throw new Error("Could not get task");
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
		const json: APISuccessOrError = await data.json();
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

export async function updateTask(
	task: Partial<TaskWithClass>
): Promise<TaskWithClass> {
	try {
		if (!task.id) {
			throw new Error("Task id is required");
		}
		const data = await fetch(`/api/tasks/edit`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(task),
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
