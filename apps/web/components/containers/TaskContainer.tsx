import { Stack } from "@mantine/core";
import { TaskWithClass } from "types";
import Task, { TaskOptionProps } from "../data-display/Task";
import TaskSkeleton from "../skeletons/TaskSkeleton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";

type TaskContainerProps = TaskOptionProps & {
	tasks: TaskWithClass[] | undefined;
	skeletonLength?: number;
	loading?: boolean;
	disableAnimation?: boolean;
};

export default function TaskContainer({
	tasks,
	loading = false,
	skeletonLength = 8,
	disableAnimation = false,
	...props
}: TaskContainerProps) {
	const [parent] = useAutoAnimate<HTMLDivElement>();

	const taskElements = tasks
		? tasks.map((task) => {
				return <Task {...props} key={task.id} task={task} />;
		  })
		: null;

	if (loading || !tasks) {
		return (
			<Stack spacing="sm">
				{[...Array(skeletonLength)].map((e, i) => (
					<TaskSkeleton key={i} {...props} />
				))}
			</Stack>
		);
	}

	return (
		<Stack spacing="sm" ref={disableAnimation ? null : parent}>
			{taskElements}
		</Stack>
	);
}
