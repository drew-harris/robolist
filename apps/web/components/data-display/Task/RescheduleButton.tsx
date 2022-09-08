import { ActionIcon, Box, Modal, Tooltip } from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { Rotate360 } from "tabler-icons-react";
import { TaskWithClass } from "types";
import { SettingsContext } from "../../../contexts/SettingsContext";
import useTaskMutation from "../../../hooks/useTaskMutation";
import { logEvent } from "../../../lib/ga";
import { canReschedule } from "../../../utils/tasks";
import CalendarHeatmapDatePicker from "../../input/CalendarHeatmapDatePicker";

interface RescheduleButtonProps {
	task: TaskWithClass;
	includeGap?: boolean;
}
export default function RescheduleButton(props: RescheduleButtonProps) {
	const { task, includeGap } = props;
	const [opened, setOpened] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(task.workDate);
	const { settings } = useContext(SettingsContext);

	const { rescheduleMutation } = useTaskMutation();

	const handleSelect = (date: Date | null) => {
		setSelectedDate(date);
		if (date) {
			rescheduleMutation.mutate({ date: date, task: task });
			logEvent("reschedule");
		}
		setOpened(false);
	};

	const times = useMemo(() => {
		let thisMorning = new Date();
		thisMorning.setHours(0, 0, 0, 0);
		let dueDate = task.dueDate;
		let dayBeforeDueDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 999);
		dayBeforeDueDate.setHours(dayBeforeDueDate.getHours() + 1);
		return {
			thisMorning,
			dayBeforeDueDate,
			dueDate,
		};
	}, [task]);

	if (times.dayBeforeDueDate.getTime() < times.thisMorning.getTime()) {
		times.dayBeforeDueDate = times.thisMorning;
	}

	const onButtonClick = () => {
		if (task.dueDate <= times.thisMorning) {
			rescheduleMutation.mutate({ date: times.thisMorning, task: task });
			logEvent("reschedule");
		} else {
			setOpened(true);
		}
	};

	if (!canReschedule(task, settings)) {
		if (includeGap) {
			return <Box sx={{ width: "22px" }}></Box>;
		} else return null;
	}

	return (
		<>
			<Tooltip label="Reschedule" openDelay={300}>
				<ActionIcon
					loading={rescheduleMutation.isLoading}
					onClick={onButtonClick}
					size="sm"
				>
					<Rotate360 size={18} />
				</ActionIcon>
			</Tooltip>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="Reschedule"
			>
				<CalendarHeatmapDatePicker
					selectedDate={selectedDate}
					minDate={times.thisMorning}
					maxDate={times.dayBeforeDueDate}
					onSelectDate={handleSelect}
					fullWidth
					allowLevelChange={false}
					disableOutsideEvents={false}
				/>
			</Modal>
		</>
	);
}
