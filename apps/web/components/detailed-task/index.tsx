import { Badge, Box, Group, Sx, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useContext } from "react";
import { TaskWithClass } from "types";
import { SettingsContext } from "../../contexts/SettingsContext";
import RescheduleButton from "../data-display/Task/RescheduleButton";
import TaskCheckbox from "../data-display/Task/TaskCheckbox";
import TaskMenu from "../data-display/Task/TaskMenu";
import TaskPlayButton from "../data-display/Task/TaskPlayButton";

interface detailedTaskProps {
	task: TaskWithClass;
	isShaded: boolean;
}

export const gridSettings: Sx = {
	gridTemplateColumns: "35px 2fr 1fr 1fr 1fr 1fr auto",
	alignItems: "center",
};
export const endSx: Sx = {
	justifySelf: "end",
};

export default function DetailedTask({ task, isShaded }: detailedTaskProps) {
	const isMobile = useMediaQuery("(max-width: 900px)", false);
	const { settings } = useContext(SettingsContext);
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
	const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const checkboxElement =
		task.workTime && settings.useFocusMode && task.workDate <= today ? (
			<TaskPlayButton task={task} />
		) : (
			<TaskCheckbox
				task={task}
				disabled={task.workDate >= today}
				key={task.id}
			/>
		);
	return (
		<tr>
			<Box mr="0">{checkboxElement}</Box>
			<Text weight="bolder" pr="sm">
				{task.title}
			</Text>
			<Box>
				{task.class ? (
					<Badge color={task.class?.color}>{task.class?.name}</Badge>
				) : null}
			</Box>
			<Text sx={endSx}>
				{task.workDate.toLocaleDateString("en-us", {
					day: "numeric",
					month: "short",
				})}
			</Text>
			<Tooltip
				label="Due in the next 24 hours"
				disabled={task.dueDate > tomorrow}
			>
				<Text sx={endSx} color={tomorrow > task.dueDate ? "yellow" : undefined}>
					{task.dueDate.toLocaleDateString("en-us", {
						day: "numeric",
						month: "short",
					})}
				</Text>
			</Tooltip>
			{task.workTime ? (
				<Text sx={endSx}>{task.workTime + "min."}</Text>
			) : (
				<Box />
			)}
			<Group sx={endSx} ml="xl">
				<Box>
					<RescheduleButton task={task} />
				</Box>
				<TaskMenu
					task={task}
					options={{ delete: true, edit: true }}
					showDueDate={false}
				/>
			</Group>
		</tr>
	);
}
