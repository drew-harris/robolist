import { ActionIcon, Loader, Tooltip, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useContext } from "react";

import { BsCheck, BsHourglassTop } from "react-icons/bs";
import { FaStopwatch } from "react-icons/fa";
import { TbHourglassHigh } from "react-icons/tb";
import { HourglassHigh } from "tabler-icons-react";
import { TaskWithClass } from "types";
import { FocusContext } from "../../../contexts/FocusContext";
import { logEvent } from "../../../lib/ga";

interface TaskPlayButtonProps {
	task: TaskWithClass;
}

const iconSize = 18;

export default function TaskPlayButton({ task }: TaskPlayButtonProps) {
	const { focusState, fn: focusFn } = useContext(FocusContext);

	const modals = useModals();

	const startTask = () => {
		if (focusState.task) {
			modals.openConfirmModal({
				title: "Change Tasks?",
				onConfirm: () => {
					focusFn.startTask(task);
				},
				children: (
					<>
						<Text size="sm">
							Are you sure you want to switch tasks and <u>lose progress?</u>
						</Text>
					</>
				),
				labels: {
					confirm: "Change Task",
					cancel: "Keep Working",
				},
				confirmProps: {
					color: "red",
				},
			});
		} else {
			focusFn.startTask(task);
			logEvent("start_task");
		}
	};

	if (task.complete) {
		return <BsCheck size={iconSize} />;
	}

	return (
		<>
			{focusState.task?.id === task.id ? (
				<Loader variant="dots" size={iconSize} />
			) : (
				<Tooltip label="Start working" openDelay={200}>
					<ActionIcon onClick={startTask} size={iconSize}>
						<TbHourglassHigh size={iconSize} />
					</ActionIcon>
				</Tooltip>
			)}
		</>
	);
}
