import { Center } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { TaskWithClass } from "types";
import { getTodayTasks } from "../clientapi/tasks";
import BigFocusTimer from "../components/data-display/focus/BigFocusTimer";
import TodayTaskPicker from "../components/input/TodayTaskPicker";
import { FocusContext } from "../contexts/FocusContext";

export default function TodayTasksPage(props: any) {
	const { focusState, fn: focusFn, setFocusState } = useContext(FocusContext);
	const selectTask = (task: TaskWithClass) => {
		focusFn.startTask(task);
	};

	return (
		<Center
			sx={{
				height: "95%",
			}}
		>
			{/* Today Task Picker is already filtered to avoid query pop in */}
			<TodayTaskPicker onTaskSelect={selectTask} />
			{focusState.task && <BigFocusTimer />}
		</Center>
	);
}
