import { Badge, Box, Sx, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { TaskWithClass } from "types";
import RescheduleButton from "../data-display/Task/RescheduleButton";
import TaskCheckbox from "../data-display/Task/TaskCheckbox";
import TaskMenu from "../data-display/Task/TaskMenu";

interface detailedTaskProps {
	task: TaskWithClass;
	isShaded: boolean;
}

export const gridSettings: Sx = {
	gridTemplateColumns: "35px 1fr 2fr 1fr 1fr 1fr auto",
	alignItems: "center",
};

export default function DetailedTask({ task, isShaded }: detailedTaskProps) {
	const isMobile = useMediaQuery("(max-width: 900px)", false);
	const gridSx: Sx = (theme) => {
		const lightBgColor =
			theme.colorScheme === "dark"
				? theme.colors.dark["7"]
				: theme.colors.gray[1];
		return {
			display: !isMobile ? "grid" : "flex",
			flexDirection: "column",
			opacity: task.complete ? 0.4 : 1,
			transition: "opacity .20s linear, height 1.20s linear",
			backgroundColor: isShaded ? lightBgColor : "transparent",
			...gridSettings,
		};
	};
	return (
		<Box sx={gridSx} p="md">
			<Box mr="0">
				<TaskCheckbox task={task} />
			</Box>
			<Text weight="bolder">{task.title}</Text>
			<Box>
				{task.class ? (
					<Badge color={task.class?.color}>{task.class?.name}</Badge>
				) : null}
			</Box>
			<Text>
				{task.workDate.toLocaleDateString("en-us", {
					day: "numeric",
					month: "short",
				})}
			</Text>
			<Text>
				{task.dueDate.toLocaleDateString("en-us", {
					day: "numeric",
					month: "short",
				})}
			</Text>
			<Text>{task.workTime + "min."}</Text>
			<TaskMenu
				task={task}
				options={{ delete: true, edit: true }}
				showDueDate={false}
			/>
		</Box>
	);
}
