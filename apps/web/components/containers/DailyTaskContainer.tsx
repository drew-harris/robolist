import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Sx } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { DailyWithClass } from "types";
import { InferQueryOutput } from "../../utils/trpc";
import DailyTask, { DailyTaskOptionProps } from "../data-display/DailyTask";
import TaskSkeleton from "../skeletons/TaskSkeleton";
import CenterInfo from "../small/CenterInfo";

type DailyTaskContainerProps = DailyTaskOptionProps & {
	tasks: InferQueryOutput<"daily.on-dates"> | undefined;
	loading?: boolean;
	grid?: boolean;
	skeletonLength?: number;
};

export default function DailyTaskContainer({
	tasks,
	loading = false,
	grid = false,
	skeletonLength = 3,
	...props
}: DailyTaskContainerProps) {
	const isMobile = useMediaQuery("(max-width: 900px)", false);

	const boxSx: Sx = (theme) => ({
		display: grid && !isMobile ? "grid" : "flex",
		gridTemplateColumns:
			grid && !isMobile ? "repeat(auto-fit, minmax(300px, 1fr))" : "",
		flexDirection: "column",
		gap: theme.spacing.md,
	});

	if (loading || !tasks) {
		return (
			<Box sx={boxSx}>
				{[...Array(skeletonLength)].map((e, i) => (
					<TaskSkeleton key={i} {...props} />
				))}
			</Box>
		);
	}

	return <RealDailyTaskContainer boxSx={boxSx} tasks={tasks} {...props} />;
}

function RealDailyTaskContainer({
	tasks,
	grid,
	boxSx,
	...props
}: DailyTaskContainerProps & { boxSx?: Sx }) {
	const [parent] = useAutoAnimate<HTMLDivElement>();

	const elements = tasks
		? tasks.map((task: DailyWithClass) => {
				return <DailyTask {...props} key={task.id} task={task} />;
		  })
		: [];
	return (
		<>
			{elements?.length < 1 && (
				<CenterInfo weight={400} text="No daily tasks" />
			)}
			<Box sx={boxSx} ref={parent}>
				{elements}
			</Box>
		</>
	);
}
