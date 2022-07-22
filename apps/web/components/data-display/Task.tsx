import { Box, Sx, Text } from "@mantine/core";
import { TaskWithClass } from "types";

interface TaskProps {
  task: TaskWithClass;
}

const mainBoxSx: Sx = (theme) => {
  return {
    padding: theme.spacing.md,
    background: theme.colorScheme === "dark" ? theme.colors.gray[9] : "white",
    borderRadius: theme.radius.sm,
  };
};

const Task = (props: TaskProps) => {
  return (
    <Box sx={mainBoxSx}>
      <Text>{props.task.title}</Text>
    </Box>
  );
};

export default Task;
