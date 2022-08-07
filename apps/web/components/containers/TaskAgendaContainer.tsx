import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Divider, Group, Space, Stack, Text, Title } from "@mantine/core";
import { useContext, useMemo } from "react";
import { TaskWithClass, TDemoTask } from "types";
import { SettingsContext } from "../../contexts/SettingsContext";
import { getHumanDateString, reduceDates, thisMorning } from "../../utils/client";
import Task, { TaskOptionProps } from "../data-display/Task";
import DemoTask from "../demo/DemoTask";
import TaskSkeleton from "../skeletons/TaskSkeleton";

type TaskContainerProps = TaskOptionProps & {
	tasks: TaskWithClass[] | undefined | TDemoTask[];
	skeletonLength?: number;
	loading?: boolean;
	disableAnimation?: boolean;
	demo?: boolean;
};

export default function TaskAgendaContainer({
	tasks,
	loading = false,
	skeletonLength = 8,
	disableAnimation = false,
	demo = false,
	...props
}: TaskContainerProps) {
	const [parent] = useAutoAnimate<HTMLDivElement>();

	const { settings } = useContext(SettingsContext);
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
			<Stack spacing="sm">
				{[...Array(skeletonLength)].map((e, i) => (
					<TaskSkeleton key={i} {...props} />
				))}
			</Stack>
		);
	}

	const elements: JSX.Element[] = [];
	let addedDivider = false;
	groups.forEach((group) => {
		if (group[0].workDate >= thisMorning() && !addedDivider) {
			elements.push(<Divider id="divider" my="md" />)
			addedDivider = true;
		}
		elements.push(
			<Group id={getHumanDateString(group[0].workDate)}>
				<Title order={4}>{getHumanDateString(group[0].workDate)}</Title>
				{settings.useTimeEstimate && (
					<Text color="dimmed">{getGroupTime(group)} min.</Text>
				)}
			</Group>
		);

		group.forEach((task) => {
			if (demo) {
				elements.push(<DemoTask {...props} key={task.id} task={task} />);
			} else {
				elements.push(<Task {...props} key={task.id} task={task} />);
			}
		});

		elements.push(
			<Space />
		);
	});

	return (
		<Stack spacing="sm" ref={disableAnimation ? null : parent}>
			{elements}
		</Stack>
	);
}
