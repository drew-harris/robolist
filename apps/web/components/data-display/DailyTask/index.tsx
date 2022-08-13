import {
	ActionIcon,
	Badge,
	Box,
	Checkbox,
	Group,
	Menu,
	Paper,
	Text,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useContext, useState } from "react";
import Confetti from "react-dom-confetti";
import { Dots, Pencil, Trash } from "tabler-icons-react";
import { DailyWithClass } from "types";
import { SettingsContext } from "../../../contexts/SettingsContext";
import useDailyMutation from "../../../hooks/useDailyMutation";
import { getShortNameOfDay, thisMorning } from "../../../utils/client";
import { confettiConfig } from "../../../utils/confetti";
import { TaskMenuOptions } from "../../demo/DemoTask";
import EditDailyTaskModal from "../../modals/EditDailyTaskModal";
import { taskPaperProps } from "../Task";

type DailyTaskProps = DailyTaskOptionProps & {
	task: DailyWithClass;
};

export interface DailyTaskOptionProps {
	checkbox?: boolean;
	showBadges?: boolean;
	menu?: TaskMenuOptions | null;
}
export default function DailyTask({
	task,
	checkbox = false,
	showBadges = false,
	menu = null,
	...props
}: DailyTaskProps) {
	const isChecked = task.lastCompleted.getTime() > thisMorning().getTime();
	const { completeDaily, uncheckDaily, deleteDaily } = useDailyMutation();
	const modals = useModals();
	const [showConfetti, setShowConfetti] = useState(false);
	const { settings } = useContext(SettingsContext);

	const promptDelete = () => {
		modals.openConfirmModal({
			title: "Delete Task?",
			onConfirm: () => {
				deleteDaily.mutate(task.id);
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
			children: <EditDailyTaskModal task={task} />,
			title: "Edit Task",
			size: "lg",
		});
	};

	const check = () => {
		if (task.lastCompleted.getTime() > thisMorning().getTime()) {
			uncheckDaily.mutate(task.id);
			return;
		}
		setShowConfetti(true);
		completeDaily.mutate(task.id);
	};

	const menuComponent = menu ? (
		<Menu position="bottom-end" withinPortal={true}>
			<Menu.Target>
				<ActionIcon size="sm">
					<Dots></Dots>
				</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				{menu.edit && (
					<Menu.Item onClick={promptEdit} icon={<Pencil />}>
						Edit
					</Menu.Item>
				)}
				{menu.delete && (
					<Menu.Item color="red" onClick={promptDelete} icon={<Trash />}>
						Delete
					</Menu.Item>
				)}
			</Menu.Dropdown>
		</Menu>
	) : null;

	const dayBadges =
		task.days.length === 7 ? (
			<Badge variant="filled" color="gray" size="sm">
				Every day
			</Badge>
		) : (
			task.days.map((dayNum: number) => {
				return (
					<Badge color="gray" size="sm">
						{getShortNameOfDay(dayNum)}
					</Badge>
				);
			})
		);

	return (
		<Paper
			sx={{
				opacity: isChecked ? 0.4 : 1,
				transition: "opacity .20s linear, height 1.20s linear",
			}}
			{...taskPaperProps}
		>
			<Group position="apart">
				<Group>
					{checkbox && (
						<Box>
							<Checkbox
								aria-label="Complete task"
								onClick={check}
								defaultChecked={isChecked}
							/>
							{settings.confettiEffect && (
								<Confetti active={showConfetti} config={confettiConfig} />
							)}
						</Box>
					)}
					<Text weight="bolder" size="sm">
						{task.title}
					</Text>
					{task.class && (
						<Badge color={task.class?.color}>{task.class.name}</Badge>
					)}
					{showBadges && dayBadges}
				</Group>
				{menuComponent}
			</Group>
		</Paper>
	);
}
