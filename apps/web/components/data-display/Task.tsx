import { Badge, Group, Paper, Sx, Text, useMantineTheme } from "@mantine/core";
import { TaskWithClass } from "types";

interface TaskProps {
  task: TaskWithClass;
}

const Task = ({ task }: TaskProps) => {
  const theme = useMantineTheme();

  const groupSx: Sx = (theme) => {
    return {};
  };
  return (
    <Paper p="md" sx={groupSx}>
      <Group>
        <Text>{task.title}</Text>
        {task.class && (
          <Badge size="sm" color={task.class.color}>
            {task.class?.name}
          </Badge>
        )}
      </Group>
    </Paper>
  );
};

export default Task;
