import { Box, Checkbox } from "@mantine/core";
import { useContext, useState } from "react";
import Confetti from "react-dom-confetti";
import { TaskWithClass } from "types";
import { SettingsContext } from "../../../contexts/SettingsContext";
import useTaskMutation from "../../../hooks/useTaskMutation";
import { logEvent } from "../../../lib/ga";
import { confettiConfig } from "../../../utils/confetti";

interface TaskCheckboxProps {
	task: TaskWithClass;
	disabled?: boolean;
}

export default function TaskCheckbox({ task, disabled }: TaskCheckboxProps) {
	const { settings } = useContext(SettingsContext);
	const [showConfetti, setShowConfetti] = useState(false);
	const { checkMutation } = useTaskMutation();

	const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		checkMutation.mutate({
			id: task.id,
			complete: event.target.checked,
		});
		if (event.target.checked) {
			setShowConfetti(true);
			logEvent("complete_task", {
				label: "task_component",
			});
		}
	};

	return (
		<Box>
			<Checkbox
				size="sm"
				aria-label="Complete task"
				checked={task.complete}
				onChange={onCheck}
				disabled={disabled}
			/>
			{settings.confettiEffect && (
				<Confetti active={showConfetti} config={confettiConfig} />
			)}
		</Box>
	);
}
