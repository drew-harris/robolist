import { Stack } from "@mantine/core";
import { TaskWithClass } from "types";
import Task, { TaskOptionProps } from "../data-display/Task";
import TaskSkeleton from "../skeletons/TaskSkeleton";

type TaskContainerProps = TaskOptionProps & {
  tasks: TaskWithClass[] | undefined;
  options?: TaskOptionProps;
  skeletonLength?: number;
  loading?: boolean;
};

const defaultTaskOptions: TaskOptionProps = {};

export default function TaskContainer({
  tasks,
  options = defaultTaskOptions,
  loading = false,
  skeletonLength = 8,
}: TaskContainerProps) {
  const taskElements = tasks
    ? tasks.map((task) => {
        return <Task {...options} key={task.id} task={task} />;
      })
    : null;

  if (loading || !tasks) {
    return (
      <Stack spacing="sm">
        {[...Array(skeletonLength)].map((e, i) => (
          <TaskSkeleton key={i} {...options} />
        ))}
      </Stack>
    );
  }

  return <Stack spacing="sm">{taskElements}</Stack>;
}
