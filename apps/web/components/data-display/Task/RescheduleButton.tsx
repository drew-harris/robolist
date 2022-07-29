import { ActionIcon, Tooltip } from "@mantine/core";
import { useState } from "react";
import { Rotate360 } from "tabler-icons-react";
import { TaskWithClass } from "types";

interface RescheduleButtonProps {
  task: TaskWithClass;
}
export default function RescheduleButton(props: RescheduleButtonProps) {
  const { task } = props;
  const [loading, setLoading] = useState(false);

  const handleReschedule = () => {
    // onReschedule(id);
  };

  return (
    <Tooltip label="Reschedule" openDelay={300}>
      <ActionIcon loading={loading}>
        <Rotate360 size={18} />
      </ActionIcon>
    </Tooltip>
  );
}
