import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Stack } from "@mantine/core";
import { DailyWithClass } from "types";
import { InferQueryOutput } from "../../utils/trpc";
import DailyTask, { DailyTaskOptionProps } from "../data-display/DailyTask";
import TaskSkeleton from "../skeletons/TaskSkeleton";
import CenterInfo from "../small/CenterInfo";

type DailyTaskContainerProps = DailyTaskOptionProps & {
	tasks: InferQueryOutput<"daily.on-dates"> | undefined;
	loading?: boolean;
	skeletonLength?: number;
};

export default function DailyTaskContainer({
	tasks,
	loading = false,
	skeletonLength = 3,
	...props
}: DailyTaskContainerProps) {
	if (loading || !tasks) {
		return (
			<Stack spacing="sm">
				{[...Array(skeletonLength)].map((e, i) => (
					<TaskSkeleton key={i} {...props} />
				))}
			</Stack>
		);
	}

	return <RealDailyTaskContainer tasks={tasks} {...props} />;
}

function RealDailyTaskContainer({ tasks, ...props }: DailyTaskContainerProps) {
	const [parent] = useAutoAnimate<HTMLDivElement>();
	const elements = tasks
		? tasks.map((task) => {
				return <DailyTask {...props} key={task.id} task={task} />;
		  })
		: [];
	return (
		<>
			{elements?.length < 1 && (
				<CenterInfo weight={400} text="No daily tasks today" />
			)}
			<Stack spacing="sm" ref={parent}>
				{elements}
			</Stack>
		</>
	);
}
