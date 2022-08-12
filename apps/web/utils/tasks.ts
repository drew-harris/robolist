import { isSameDate } from "@mantine/dates";
import { Settings, TaskWithClass } from "types";

export const canReschedule = (task: TaskWithClass, settings: Settings) => {
	let thisMorning = new Date();
	thisMorning.setHours(0, 0, 0, 0);
	let dueDate = task.dueDate;
	let dayBeforeDueDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 999);
	dayBeforeDueDate.setHours(dayBeforeDueDate.getHours() + 1);

	if (
		(isSameDate(task.workDate, thisMorning) &&
			!task.complete &&
			task.dueDate <= thisMorning) ||
		task.complete ||
		(task.workDate <= thisMorning && settings.useStrictMode)
	) {
		return false;
	}
	return true;
};
