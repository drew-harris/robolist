import { TaskWithClass } from "types";

export async function getClasses(): Promise<TaskWithClass[]> {
  try {
    const data = await fetch("/api/tasks");
    const json = await data.json();
    if (json.error) {
      console.error(json.error);
      throw new Error(json.error.message);
    }
    return json.tasks;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
