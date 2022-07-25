import {
  Badge,
  Checkbox,
  Group,
  Paper,
  Sx,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { TaskWithClass } from "types";
import TaskCheckbox from "./TaskCheckbox";

type TaskProps = TaskOptionProps & {
  task: TaskWithClass;
};

export interface TaskOptionProps {
  hideCheckbox?: boolean;
  disableCheck?: boolean;
  disableEdit?: boolean;
  hideClassLabel?: boolean;
  disableQuickSettings?: boolean;
}

const Task = ({
  task,
  disableCheck = false,
  hideCheckbox = false,
  disableEdit = false,
  disableQuickSettings = false,
  hideClassLabel = false,
  ...props
}: TaskProps) => {
  const theme = useMantineTheme();

  const groupSx: Sx = (theme) => {
    return {
      opacity: task.complete ? 0.4 : 1,
      transition: "opacity .20s linear",
    };
  };
  return (
    <Paper p="md" shadow="xs" sx={groupSx}>
      <Group>
        {!hideCheckbox && <TaskCheckbox task={task} disabled={disableCheck} />}
        <Text>{task.title}</Text>
        {task.class && !hideClassLabel && (
          <Badge size="sm" color={task.class.color}>
            {task.class?.name}
          </Badge>
        )}
      </Group>
    </Paper>
  );
};

export default Task;
