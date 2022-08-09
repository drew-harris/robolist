import { Box, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { TaskWithClass } from "types";
import { getTasks } from "../../clientapi/tasks";
import TaskAgendaContainer from "../../components/containers/TaskAgendaContainer";
import CenterInfo from "../../components/small/CenterInfo";
import NewTaskButton from "../../components/small/NewTaskButton";
import { vanilla } from "../../utils/trpc";

export default function TasksPage() {
	const {
		status,
		data: tasks,
		error,
	} = useQuery<TaskWithClass[], Error>(
		["tasks", { type: "all" }],
		getTasks
	);

	useEffect(() => {
		console.log(tasks)
	}, []);
	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}>
				<Title mb="md" order={2}>
					All Tasks
				</Title>
				<NewTaskButton />
			</Box>
			{error && <CenterInfo color="red" text={error?.message || "There was an error getting tasks"} />}
			{status != "loading" && tasks && tasks.length == 0 && (
				<CenterInfo text="No tasks yet" />
			)}
			<TaskAgendaContainer
				menu={{ delete: true, edit: true }}
				rescheduleButton
				skeletonLength={5}
				loading={status === "loading" && !error}
				tasks={tasks}
			/>
		</>
	);
}
