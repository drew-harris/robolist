import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Stack } from "@mantine/core";
import { TaskWithClass } from "types";
import Task, { TaskOptionProps } from "../data-display/Task";
import TaskSkeleton from "../skeletons/TaskSkeleton";

type TaskContainerProps = TaskOptionProps & {
	tasks: TaskWithClass[] | undefined;
	oldTasks?: TaskWithClass[] | null;
	skeletonLength?: number;
	loading?: boolean;
	disableAnimation?: boolean;
};

export default function TaskContainer({
	tasks,
	oldTasks,
	loading = false,
	skeletonLength = 8,
	disableAnimation = false,
	...props
}: TaskContainerProps) {
	if (loading && !oldTasks) {
		return (
			<Stack spacing="sm">
				{[...Array(skeletonLength)].map((e, i) => (
					<TaskSkeleton key={i} {...props} />
				))}
			</Stack>
		);
	}

	return <RealTaskContainer tasks={tasks || oldTasks || []} {...props} />;
}

function RealTaskContainer({ tasks, ...props }: TaskContainerProps) {
	const [parent] = useAutoAnimate<HTMLDivElement>();
	const taskElements = tasks
		? tasks.map((task) => {
				return <Task {...props} key={task.id} task={task} />;
		  })
		: null;
	return (
		<Stack spacing="sm" ref={parent}>
			{taskElements}
		</Stack>
	);
}
