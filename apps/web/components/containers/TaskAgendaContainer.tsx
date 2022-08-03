import { Group, Space, Stack, Title, Text, Box } from "@mantine/core";
import { TaskWithClass } from "types";
import Task, { TaskOptionProps } from "../data-display/Task";
import TaskSkeleton from "../skeletons/TaskSkeleton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, { useMemo } from "react";
import { getHumanDateString, reduceDates } from "../../utils";

type TaskContainerProps = TaskOptionProps & {
	tasks: TaskWithClass[] | undefined;
	skeletonLength?: number;
	loading?: boolean;
	disableAnimation?: boolean;
};

const defaultTaskOptions: TaskOptionProps = {};

export default function TaskAgendaContainer({
	tasks,
	loading = false,
	skeletonLength = 8,
	disableAnimation = false,
	...props
}: TaskContainerProps) {
	const [parent] = useAutoAnimate<HTMLDivElement>();

	const groups: TaskWithClass[][] = useMemo(() => {
		if (!tasks) {
			return [];
		}
		return reduceDates(tasks);
	}, [tasks]);

	const getGroupTime = (group: TaskWithClass[]) => {
		return group.reduce((acc, task) => acc + (task.workTime || 0), 0);
	};

	if (loading || !tasks) {
		return (
			<Stack spacing="sm" ref={disableAnimation ? null : parent}>
				{[...Array(skeletonLength)].map((e, i) => (
					<TaskSkeleton key={i} {...props} />
				))}
			</Stack>
		);
	}

	const elements: JSX.Element[] = [];
	groups.forEach((group) => {
		elements.push(
			<Group id={getHumanDateString(group[0].workDate)}>
				<Title order={4}>{getHumanDateString(group[0].workDate)}</Title>
				<Text color="dimmed">{getGroupTime(group)} min.</Text>
			</Group>
		);

		group.forEach((task) => {
			elements.push(<Task {...props} key={task.id} task={task} />);
		});

		elements.push(
			<Box id={getHumanDateString(group[0].workDate) + "-separator"} />
		);
	});

	return (
		<Stack spacing="sm" ref={disableAnimation ? null : parent}>
			{elements}
		</Stack>
	);
}
