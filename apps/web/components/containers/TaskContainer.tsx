import { Stack } from "@mantine/core";
import { TaskWithClass } from "types";
import Task, { TaskOptionProps } from "../data-display/Task";
import TaskSkeleton from "../skeletons/TaskSkeleton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";

type TaskContainerProps = TaskOptionProps & {
  tasks: TaskWithClass[] | undefined;
  skeletonLength?: number;
  loading?: boolean;
};

const defaultTaskOptions: TaskOptionProps = {};

export default function TaskContainer({
  tasks,
  loading = false,
  skeletonLength = 8,
  ...props
}: TaskContainerProps) {
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const taskElements = tasks
    ? tasks.map((task) => {
        return <Task {...props} key={task.id} task={task} />;
      })
    : null;

  if (loading || !tasks) {
    return (
      <Stack spacing="sm" ref={parent}>
        {[...Array(skeletonLength)].map((e, i) => (
          <TaskSkeleton key={i} {...props} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing="sm" ref={parent}>
      {taskElements}
    </Stack>
  );
}
