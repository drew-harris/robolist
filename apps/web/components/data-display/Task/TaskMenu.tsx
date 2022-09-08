import { ActionIcon, Menu, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Check, Dots, Pencil, Rotate2, Trash } from "tabler-icons-react";
import { TaskWithClass } from "types";
import { TaskMenuOptions } from ".";
import useTaskMutation from "../../../hooks/useTaskMutation";
import { getHumanDateString } from "../../../utils/client";
import EditTaskModal from "../../modals/EditTaskModal";
import LinkTaskModal from "../../modals/LinkTaskModal";
import CanvasLogo from "../../small/CanvasLogo";

export default function TaskMenu({
	options,
	task,
	showDueDate = true,
}: {
	options: TaskMenuOptions;
	task: TaskWithClass;
	showDueDate?: boolean;
}) {
	const modals = useModals();
	const { deleteMutation, editMutation, checkMutation } = useTaskMutation();

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

	const promptLink = () => {
		modals.openModal({
			children: <LinkTaskModal task={task} />,
			title: "Link Task",
		});
	};
	const completeMenuOption = () => {
		if (!task.workTime) {
			return null;
		} else if (task.complete) {
			return (
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
			);
		} else {
			return (
				<Menu.Item
					onClick={() => {
						checkMutation.mutate({
							id: task.id,
							complete: true,
						});
					}}
					icon={<Check />}
				>
					Mark Complete
				</Menu.Item>
			);
		}
	};

	return (
		<Menu position="bottom-end" withinPortal={true}>
			<Menu.Target>
				<ActionIcon size="sm">
					<Dots></Dots>
				</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				{completeMenuOption()}
				{options.edit && (
					<Menu.Item onClick={promptEdit} icon={<Pencil />}>
						Edit
					</Menu.Item>
				)}
				{options.delete && (
					<Menu.Item color="red" onClick={promptDelete} icon={<Trash />}>
						Delete
					</Menu.Item>
				)}
				{!task.canvasId && task.class?.canvasId && (
					<Menu.Item
						icon={<CanvasLogo mx={3} size={18} />}
						onClick={promptLink}
					>
						Link with Canvas
					</Menu.Item>
				)}
				{showDueDate && (
					<Menu.Label>Due {getHumanDateString(task.dueDate)}</Menu.Label>
				)}
			</Menu.Dropdown>
		</Menu>
	);
}
