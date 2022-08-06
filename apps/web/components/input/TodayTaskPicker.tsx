import { Box, Loader, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { TaskWithClass } from "types";
import { getTodayTasks } from "../../clientapi/tasks";
import { FocusContext } from "../../contexts/FocusContext";
import Task from "../data-display/Task";
import CenterInfo from "../small/CenterInfo";

interface TodayTaskPickerProps {
	onTaskSelect: (task: TaskWithClass) => void;
}

export default function TodayTaskPicker(props: TodayTaskPickerProps) {
	const {
		status,
		data: tasks,
		error,
		isRefetching,
	} = useQuery<TaskWithClass[], Error>(
		["tasks", { type: "today" }],
		getTodayTasks
	);

	const { focusState } = useContext(FocusContext);

	if (focusState.task) {
		return null;
	}

	if (status === "loading" || !tasks) {
		return <Loader />;
	} else if (error) {
		<CenterInfo text={error.message} />;
	}

	const choices = tasks
		.filter((task) => !task.complete)
		.map((task) => {
			return (
				<Task
					inline
					sx={{ width: "100%" }}
					task={task}
					key={task.id}
					onTaskClick={props.onTaskSelect}
				/>
			);
		});

	if (choices.length === 0) {
		return <CenterInfo text="No tasks today!" />;
	}

	return (
		<Stack>
			<Text align="center">Select A Task</Text>
			{choices}
		</Stack>
	);
}
