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
