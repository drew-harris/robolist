import {
	ActionIcon,
	Badge,
	Group,
	Menu,
	Paper,
	Space,
	Stack,
	Sx,
	Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { useContext } from "react";
import { FaLessThanEqual } from "react-icons/fa";
import { Dots, Trash } from "tabler-icons-react";
import { TaskWithClass } from "types";
import { SettingsContext } from "../../../contexts/SettingsContext";
import useTaskMutation from "../../../hooks/useTaskMutation";
import { getHumanDateString } from "../../../utils";
import RescheduleButton from "./RescheduleButton";
import TaskCheckbox from "./TaskCheckbox";
import TaskPlayButton from "./TaskPlayButton";

type TaskProps = TaskOptionProps & {
	task: TaskWithClass;
};

export interface TaskOptionProps {
	checkbox?: boolean;
	workdayLabel?: boolean;
	rescheduleButton?: boolean;
	hideClassLabel?: boolean;
	disableCheck?: boolean;
	menu?: TaskMenuOptions;
}

export interface TaskMenuOptions {
	delete?: boolean;
}

const Task = ({
	task,
	disableCheck = false,
	checkbox = false,
	rescheduleButton = false,
	hideClassLabel = false,
	menu: menuOptions = {
		delete: false,
	},
	workdayLabel = false,
	...props
}: TaskProps) => {
	const { settings } = useContext(SettingsContext);
	const modals = useModals();
	const { deleteMutation, checkMutation } = useTaskMutation();
	const isMobile = useMediaQuery("(max-width: 900px)", false);

	const checkboxElement = settings.useFocusMode ? (
		<TaskPlayButton task={task} />
	) : (
		<TaskCheckbox task={task} disabled={disableCheck} key={task.id} />
	);

	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const isLateWork =
		task.dueDate && !task.complete && task.workDate < oneDayAgo;
	const isOverdue = task.dueDate && !task.complete && task.dueDate < new Date();

	const promptDelete = () => {
		modals.openConfirmModal({
			title: "Delete Task?",
			onConfirm: () => {
				deleteMutation.mutate(task);
			},
			children: (
				<>
					<Text size="sm">Are you sure you want to delete this task?</Text>
				</>
			),
			labels: {
				confirm: "Delete",
				cancel: "Cancel",
			},
			confirmProps: {
				color: "red",
			},
		});
	};

	const menuComponent = menuOptions ? (
		<Menu position="bottom-end" withinPortal={true}>
			<Menu.Target>
				<ActionIcon size="sm">
					<Dots></Dots>
				</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				{settings.useFocusMode && task.complete && checkbox && (
					<Menu.Item
						onClick={() => {
							checkMutation.mutate({
								id: task.id,
								complete: false,
							});
						}}
					>
						Undo Complete
					</Menu.Item>
				)}
				{menuOptions.delete && (
					<Menu.Item color="red" onClick={promptDelete} icon={<Trash />}>
						Delete
					</Menu.Item>
				)}
			</Menu.Dropdown>
		</Menu>
	) : null;

	const paperSx: Sx = (theme) => {
		let border: string | undefined;

		if (isOverdue) {
			border = `1px solid ${theme.colors.red[5]}`;
		} else if (isLateWork) {
			border = `1px solid ${theme.colors.orange[5]}`;
		}

		return {
			opacity: task.complete ? 0.4 : 1,
			transition: "opacity .20s linear, height 1.20s linear",
			border,
		};
	};

	if (isMobile) {
		return (
			<Paper withBorder p="md" shadow="xs" sx={paperSx}>
				<Stack>
					<Group position="apart">
						<Text weight="bolder" size="sm">
							{task.title}
						</Text>
						{task.class && !hideClassLabel && (
							<>
								<Badge size="sm" color={task.class.color}>
									{task.class?.name}
								</Badge>
							</>
						)}
					</Group>
					<Group position="apart">
						<Group>
							{checkbox && checkboxElement}
							{rescheduleButton && <RescheduleButton task={task} />}
							{menuComponent}
						</Group>
						<Text size="sm">{task.workTime + "min."}</Text>
					</Group>
				</Stack>
			</Paper>
		);
	}

	return (
		<Paper withBorder p="md" shadow="xs" sx={paperSx}>
			<Group position="apart">
				<Group>
					{checkbox && checkboxElement}
					<Text weight="bolder" size="sm">
						{task.title}
					</Text>
					{task.class && !hideClassLabel && (
						<>
							<Badge size="sm" color={task.class.color}>
								{task.class?.name}
							</Badge>
						</>
					)}
					{workdayLabel && (
						<>
							<Space w="sm" />
							<Text>{getHumanDateString(task.workDate)}</Text>
						</>
					)}
				</Group>
				<Group>
					<Text size="sm">{task.workTime + "min."}</Text>
					{rescheduleButton && <RescheduleButton task={task} />}
					{menuComponent}
				</Group>
			</Group>
		</Paper>
	);
};

export default Task;
