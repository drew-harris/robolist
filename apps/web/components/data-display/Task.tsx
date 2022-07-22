import { Box, Group, Sx, Text, useMantineTheme } from "@mantine/core";
import { TaskWithClass } from "types";

interface TaskProps {
  task: TaskWithClass;
}

const Task = ({ task }: TaskProps) => {
  const theme = useMantineTheme();
  const defaultBgColor =
    theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[2];

  const backgroundColor = task?.class
    ? theme.colors[task.class.color][9]
    : defaultBgColor;

  const mainBoxSx: Sx = (theme) => {
    return {
      padding: theme.spacing.md,
      backgroundColor: backgroundColor,
      borderRadius: theme.radius.sm,
    };
  };
  return (
    <Group sx={mainBoxSx}>
      <Text>{task.title}</Text>
      <Text>{task.class?.name}</Text>
    </Group>
  );
};

export default Task;
