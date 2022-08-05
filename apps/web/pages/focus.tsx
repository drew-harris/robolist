import { Center } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { TaskWithClass } from "types";
import { getTodayTasks } from "../clientapi/tasks";
import BigFocusTimer from "../components/data-display/focus/BigFocusTimer";
import { FocusContext } from "../contexts/FocusContext";

export default function TodayTasksPage(props: any) {
	const { focusState, fn: focusFn, setFocusState } = useContext(FocusContext);
	const {
		status,
		data: tasks,
		error,
	} = useQuery<TaskWithClass[], Error>(
		["tasks", { type: "today" }],
		getTodayTasks
	);

	return (
		<Center
			sx={{
				height: "95%",
			}}
		>
			{focusState.task ? <BigFocusTimer /> : null}
		</Center>
	);
}
