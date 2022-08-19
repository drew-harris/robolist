import { TaskWithClass } from "types";
import { Text, TextProps } from "@mantine/core";

interface TodayTimeSumProps extends TextProps {
	tasks: TaskWithClass[] | null | undefined;
}

export default function TodayTimeSum({
	tasks,
	...textProps
}: TodayTimeSumProps) {
	if (!tasks) {
		return null;
	}

	const timeSum = tasks.reduce((acc, task) => acc + (task?.workTime || 0), 0);
	// const hasSimpleTasks = tasks.some((task) => !task.workTime);

	if (timeSum == 0) {
		return null;
	}

	return <Text color="dimmed" {...textProps}>{`${timeSum} min.`}</Text>;
}
