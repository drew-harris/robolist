import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Stack } from "@mantine/core";
import { TaskWithClass } from "types";
import Task, { TaskOptionProps } from "../data-display/Task";
import DetailedTask from "../detailed-task";
import DetailedTaskHeader from "../detailed-task/DetailedTaskHeader";
import TaskSkeleton from "../skeletons/TaskSkeleton";

type TaskContainerProps = TaskOptionProps & {
	tasks: TaskWithClass[] | undefined;
	oldTasks?: TaskWithClass[] | null;
	skeletonLength?: number;
	loading?: boolean;
	disableAnimation?: boolean;
	as?: "task" | "detailed";
};

export default function TaskContainer({
	tasks,
	oldTasks,
	as = "task",
	loading = false,
	skeletonLength = 8,
	disableAnimation = false,
	...props
}: TaskContainerProps) {
	if (loading && !oldTasks && as != "detailed") {
		return (
			<Stack spacing="sm">
				{[...Array(skeletonLength)].map((e, i) => (
					<TaskSkeleton key={i} {...props} />
				))}
			</Stack>
		);
	}

	return (
		<RealTaskContainer tasks={tasks || oldTasks || []} as={as} {...props} />
	);
}

function RealTaskContainer({ tasks, as, ...props }: TaskContainerProps) {
	const [parent] = useAutoAnimate<HTMLDivElement>();
	const taskElements = tasks
		? tasks.map((task, index) => {
				if (as === "detailed") {
					return (
						<DetailedTask
							isShaded={index % 2 === 0}
							task={task}
							key={task.id}
						/>
					);
				} else {
					return <Task {...props} key={task.id} task={task} />;
				}
		  })
		: null;

	return (
		<Stack spacing={as === "detailed" ? 0 : "sm"} ref={parent}>
			{as === "detailed" ? <DetailedTaskHeader /> : null}
			{taskElements}
		</Stack>
	);
}
