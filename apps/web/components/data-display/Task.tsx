import { Box } from "@mantine/core";
import { TaskWithClass } from "types";

interface TaskProps {
  task: TaskWithClass;
}

const Task = (props: TaskProps) => {
  return (
    <Box>
      {props.task.title} . {props.task.dueDate.toLocaleDateString()}
    </Box>
  );
};

export default Task;
