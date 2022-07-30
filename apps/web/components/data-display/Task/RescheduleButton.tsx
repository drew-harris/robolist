import { ActionIcon, Modal, Tooltip } from "@mantine/core";
import { useState } from "react";
import { Rotate360 } from "tabler-icons-react";
import { TaskWithClass } from "types";
import useTaskMutation from "../../../hooks/useTaskMutation";
import CalendarHeatmapDatePicker from "../../input/CalendarHeatmapDatePicker";

interface RescheduleButtonProps {
  task: TaskWithClass;
}
export default function RescheduleButton(props: RescheduleButtonProps) {
  const { task } = props;
  const [opened, setOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(task.workDate);

  const { rescheduleMutation } = useTaskMutation();

  const handleSelect = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      rescheduleMutation.mutate({ date: date, task: task });
    }
    setOpened(false);
  };

  const thisMorning = new Date();
  thisMorning.setHours(0, 0, 0, 0);
  const dueDate = task.dueDate || thisMorning;
  const dayBeforeDueDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 999);
  dayBeforeDueDate.setHours(dayBeforeDueDate.getHours() + 1);

  return (
    <>
      <Tooltip label="Reschedule" openDelay={300}>
        <ActionIcon
          loading={rescheduleMutation.isLoading}
          onClick={() => setOpened(true)}
        >
          <Rotate360 size={18} />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Choose new date"
      >
        <CalendarHeatmapDatePicker
          selectedDate={selectedDate}
          minDate={thisMorning}
          maxDate={dayBeforeDueDate}
          onSelectDate={handleSelect}
          fullWidth
          allowLevelChange={false}
          disableOutsideEvents={false}
        />
      </Modal>
    </>
  );
}
