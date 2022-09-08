import { Center, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { TaskWithClass } from "types";
import { vanilla } from "../../utils/trpc";
import { TaskOptionProps } from "../data-display/Task";
import CenterInfo from "../small/CenterInfo";
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
			return vanilla.query("tasks.by-date", date);
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
			{tasks?.length == 0 && <CenterInfo mt="xl" text="No tasks" />}
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
