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
	Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { useContext } from "react";
import {
	AlertTriangle,
	Dots,
	Pencil,
	Rotate2,
	Trash,
} from "tabler-icons-react";
import { TaskWithClass } from "types";
import { SettingsContext } from "../../../contexts/SettingsContext";
import useTaskMutation from "../../../hooks/useTaskMutation";
import { getHumanDateString } from "../../../utils/utils";
import EditTaskModal from "../../modals/EditTaskModal";
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
	inline?: boolean;
	sx?: Sx;
	menu?: TaskMenuOptions | null;
	onTaskClick?: (task: TaskWithClass) => void;
}

export interface TaskMenuOptions {
	delete?: boolean;
	edit?: boolean;
}

const Task = ({
	task,
	disableCheck = false,
	checkbox = false,
	rescheduleButton = false,
	hideClassLabel = false,
	menu: menuOptions = null,
	workdayLabel = false,
	onTaskClick = undefined,
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

	const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (onTaskClick) {
			onTaskClick(task);
		}
	};

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

	const promptEdit = () => {
		modals.openModal({
			children: <EditTaskModal task={task} />,
			title: "Edit Task",
			size: "lg",
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
						icon={<Rotate2 />}
					>
						Undo Complete
					</Menu.Item>
				)}
				{menuOptions.edit && (
					<Menu.Item onClick={promptEdit} icon={<Pencil />}>
						Edit
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
		let cursor: string | undefined;

		if (isOverdue) {
			border = `1px solid ${theme.colors.red[5]}`;
		} else if (isLateWork) {
			border = `1px solid ${theme.colors.orange[5]}`;
		}

		if (onTaskClick) {
			cursor = "pointer";
		}

		return {
			opacity: task.complete ? 0.4 : 1,
			transition: "opacity .20s linear, height 1.20s linear",
			border,
			cursor,
			...props.sx,
		};
	};

	function TimeBadges() {
		if (isOverdue) {
			return (
				<Tooltip color="red" label="It is past the due date">
					<Badge
						color="red"
						leftSection={<AlertTriangle style={{ marginTop: 7 }} size={12} />}
					>
						OVERDUE
					</Badge>
				</Tooltip>
			);
		} else if (isLateWork) {
			return (
				<Tooltip label="You did not do the task when scheduled, but it is not due yet">
					<Badge
						color="orange"
						leftSection={<AlertTriangle style={{ marginTop: 7 }} size={12} />}
					>
						Late
					</Badge>
				</Tooltip>
			);
		} else {
			return null;
		}
	}

	if (isMobile && !props.inline) {
		return (
			<Paper onClick={onClick} withBorder p="md" shadow="xs" sx={paperSx}>
				<Stack>
					<Group position="apart">
						<Text weight="bolder" size="sm">
							{task.title}
						</Text>
						<Group>
							{task.class && !hideClassLabel && (
								<>
									<Badge size="sm" color={task.class.color}>
										{task.class?.name}
									</Badge>
								</>
							)}
							<TimeBadges />
						</Group>
					</Group>
					<Group position="apart">
						<Group>
							{checkbox && checkboxElement}
							{rescheduleButton && <RescheduleButton task={task} />}
							{menuComponent}
						</Group>
						{settings.useTimeEstimate && (
							<Text size="sm">{task.workTime + "min."}</Text>
						)}
					</Group>
				</Stack>
			</Paper>
		);
	}

	return (
		<Paper onClick={onClick} withBorder p="md" shadow="xs" sx={paperSx}>
			<Group sx={{ width: "100%" }} position="apart">
				<Group>
					{checkbox && checkboxElement}
					<Text weight="bolder" size="sm">
						{task.title}
					</Text>
					<Group>
						<TimeBadges />
						{task.class && !hideClassLabel && (
							<>
								<Badge size="sm" color={task.class.color}>
									{task.class?.name}
								</Badge>
							</>
						)}
					</Group>
					{workdayLabel && (
						<>
							<Space w="sm" />
							<Text>{getHumanDateString(task.workDate)}</Text>
						</>
					)}
				</Group>
				<Group>
					{settings.useTimeEstimate && (
						<Text size="sm">{task.workTime + "min."}</Text>
					)}
					{rescheduleButton && <RescheduleButton task={task} />}
					{menuComponent}
				</Group>
			</Group>
		</Paper>
	);
};

export default Task;
