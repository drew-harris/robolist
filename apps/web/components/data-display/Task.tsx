import { Box } from "@mantine/core";
import { TaskWithClass } from "types";

interface TaskProps {
  task: TaskWithClass;
}

const Task = (props: TaskProps) => {
  return <Box>{props.task.title}</Box>;
};

export default Task;
