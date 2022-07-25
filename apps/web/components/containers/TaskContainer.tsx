import { Stack } from "@mantine/core";
import { TaskWithClass } from "types";
import Task, { TaskOptionProps } from "../data-display/Task";
import TaskSkeleton from "../skeletons/TaskSkeleton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";

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
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const taskElements = tasks
    ? tasks.map((task) => {
        return <Task {...options} key={task.id} task={task} />;
      })
    : null;

  if (loading || !tasks) {
    return (
      <Stack spacing="sm" ref={parent}>
        {[...Array(skeletonLength)].map((e, i) => (
          <TaskSkeleton key={i} {...options} />
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
