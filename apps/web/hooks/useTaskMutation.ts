import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { RescheduleInput, TaskWithClass } from "types";
import { deleteTask, rescheduleTask } from "../clientapi/tasks";
import { FocusContext } from "../contexts/FocusContext";

export default function useTaskMutation() {
  const queryClient = useQueryClient();
  const focus = useContext(FocusContext);

  const deleteMutation = useMutation(
    (task: TaskWithClass) => {
      return deleteTask(task.id);
    },
    {
      onMutate: async (task: TaskWithClass) => {
        await queryClient.cancelQueries(["tasks"]);
        await queryClient.setQueriesData(
          ["tasks"],
          (oldData: TaskWithClass[] | undefined) => {
            return oldData?.filter((t) => t.id !== task.id);
          }
        );
      },

      onSuccess: async (data, task, context) => {
        if (focus.focusState.task && focus.focusState.task.id === task.id) {
          focus.fn.cancel();
        }
        await queryClient.invalidateQueries(["tasks"]);
      },

      onError: async (task: TaskWithClass) => {
        await queryClient.setQueriesData(
          ["tasks"],
          (oldData: TaskWithClass[] | undefined) => {
            if (!oldData) {
              return;
            }
            return [...oldData, task];
          }
        );
        await queryClient.invalidateQueries(["tasks"]);
        showNotification({
          message: "Error deleting task",
          color: "red",
        });
      },
    }
  );

  const rescheduleMutation = useMutation(
    (input: RescheduleInput) => {
      return rescheduleTask(input.task, input.date);
    },
    {
      onMutate: async () => {},
      onError: async () => {
        showNotification({
          message: "Error rescheduling task",
          color: "red",
        });
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(["tasks"]);
      },
    }
  );

  return { deleteMutation, rescheduleMutation };
}
