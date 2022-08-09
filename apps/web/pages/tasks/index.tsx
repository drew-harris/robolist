import { Box, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { TaskWithClass } from "types";
import { getTasks } from "../../clientapi/tasks";
import TaskAgendaContainer from "../../components/containers/TaskAgendaContainer";
import CenterInfo from "../../components/small/CenterInfo";
import NewTaskButton from "../../components/small/NewTaskButton";
import useInitialPrefetch from "../../hooks/useInitialPrefetch";
import { trpc } from "../../utils/trpc";

export default function TasksPage() {

	const { data: tasks, error, status } = trpc.useQuery(["tasks.all-tasks"]);
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
			{error && <CenterInfo color="red" text={error.message} />}
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
