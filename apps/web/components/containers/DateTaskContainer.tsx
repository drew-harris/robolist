import { Center, Container, Loader, ScrollArea, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { TaskWithClass } from "types";
import { getTasksByDate } from "../../clientapi/tasks";
import { getHumanDateString } from "../../utils";
import TaskContainer from "./TaskContainer";

interface DateTaskContainerProps {
  date: Date;
}
export default function DateTaskContainer({ date }: DateTaskContainerProps) {
  const {
    data: tasks,
    error,
    status,
  } = useQuery<TaskWithClass[], Error>(
    ["tasks", { date: date.toISOString() }],
    () => {
      return getTasksByDate(date);
    },
    {}
  );

  if (status == "loading") {
    return (
      <Center
        sx={(theme) => ({
          flexGrow: 1,
        })}
      >
        <Loader></Loader>
      </Center>
    );
  }

  return (
    <>
      {tasks && (
        <TaskContainer
          rescheduleButton
          menu={{ delete: true }}
          disableAnimation
          tasks={tasks}
        />
      )}
    </>
  );
}
