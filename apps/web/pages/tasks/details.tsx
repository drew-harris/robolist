import { Box, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import TaskContainer from "../../components/containers/TaskContainer";
import SortBySelector, {
	SortByValueOptions,
} from "../../components/details/SortBySelector";
import CenterInfo from "../../components/small/CenterInfo";
import useSkeletonCount from "../../hooks/useSkeletonCount";
import { InferQueryOutput, trpc } from "../../utils/trpc";

export default function TaskDetailsPage() {
	const [sortBy, setSortBy] = useState<SortByValueOptions>("dueDate");
	const { data, status, error } = trpc.useQuery(
		["tasks.details", { sortBy: sortBy }],
		{
			ssr: false,
		}
	);

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
			>
				<Title mb="md" order={2}>
					Details
				</Title>
				<SortBySelector value={sortBy} setValue={setSortBy} />
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
