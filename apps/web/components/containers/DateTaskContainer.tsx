import { Center, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { TaskWithClass } from "types";
import { getTasksByDate } from "../../clientapi/tasks";
import { TaskOptionProps } from "../data-display/Task";
import TaskContainer from "./TaskContainer";

interface DateTaskContainerProps extends TaskOptionProps {
	date: Date;
}
export default function DateTaskContainer({
	date,
	...props
}: DateTaskContainerProps) {
	const {
		data: tasks,
		error,
		status,
	} = useQuery<TaskWithClass[], Error>(
		["tasks", { date: date.toISOString() }],
		() => {
			return getTasksByDate(date);
		},
		{}
	);

	if (status == "loading") {
		return (
			<Center
				sx={(theme) => ({
					flexGrow: 1,
				})}
			>
				<Loader></Loader>
			</Center>
		);
	}

	return (
		<>
			{tasks && (
				<TaskContainer
					menu={{ delete: true }}
					{...props}
					disableAnimation
					tasks={tasks}
				/>
			)}
		</>
	);
}
