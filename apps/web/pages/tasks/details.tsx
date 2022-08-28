import { Box, Group, Title, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import TaskContainer from "../../components/containers/TaskContainer";
import SortBySelector, {
	SortByValueOptions,
} from "../../components/details/SortBySelector";
import CenterInfo from "../../components/small/CenterInfo";
import useSkeletonCount from "../../hooks/useSkeletonCount";
import { InferQueryOutput, vanilla } from "../../utils/trpc";
export default function TaskDetailsPage() {
	const [sortBy, setSortBy] = useState<SortByValueOptions>("dueDate");

	const { data, status, error } = useQuery<
		InferQueryOutput<"tasks.details">,
		Error
	>(["tasks", { sortBy }], () => {
		return vanilla.query("tasks.details", { sortBy: sortBy });
	});

	const [oldTasks, setOldTasks] =
		useState<InferQueryOutput<"tasks.details"> | null>(null);

	const skeletonCount = useSkeletonCount("details", data);

	useEffect(() => {
		if (!data) return;
		setOldTasks(data);
	}, [data]);

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
				mb="xl"
			>
				<Title mb="md" order={2}>
					Details
				</Title>
				<Group>
					<SortBySelector value={sortBy} setValue={setSortBy} />
				</Group>
			</Box>
			{error && (
				<CenterInfo
					color="red"
					text={error?.message || "There was an error getting tasks"}
				/>
			)}
			<TaskContainer
				oldTasks={oldTasks}
				skeletonLength={skeletonCount}
				loading={status === "loading"}
				as="detailed"
				menu={{
					delete: true,
					edit: true,
				}}
				checkbox={true}
				tasks={data}
			/>
		</>
	);
}
