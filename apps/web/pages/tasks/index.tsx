import { Box, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { TaskWithClass } from "types";
import TaskAgendaContainer from "../../components/containers/TaskAgendaContainer";
import CenterInfo from "../../components/small/CenterInfo";
import NewTaskButton from "../../components/small/NewTaskButton";
import useInitialPrefetch from "../../hooks/useInitialPrefetch";
import useSkeletonCount from "../../hooks/useSkeletonCount";
import { vanilla } from "../../utils/trpc";

export default function TasksPage() {
	const {
		status,
		data: tasks,
		error,
	} = useQuery<TaskWithClass[], Error>(["tasks", { type: "all" }], () =>
		vanilla.query("tasks.all")
	);

	useInitialPrefetch();
	const skeletonCount = useSkeletonCount("agenda", tasks);

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Title mb="md" order={2}>
					All Tasks
				</Title>
				<NewTaskButton />
			</Box>
			{error && (
				<CenterInfo
					color="red"
					text={error?.message || "There was an error getting tasks"}
				/>
			)}
			{status != "loading" && tasks && tasks.length == 0 && (
				<CenterInfo text="No tasks yet" />
			)}
			<TaskAgendaContainer
				menu={{ delete: true, edit: true }}
				rescheduleButton
				skeletonLength={skeletonCount}
				loading={status === "loading" && !error}
				// loading={true}
				tasks={tasks}
			/>
		</>
	);
}
