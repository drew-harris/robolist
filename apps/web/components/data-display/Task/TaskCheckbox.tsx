import { Checkbox } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { APICompleteRequest, TaskWithClass } from "types";
import { markTaskStatus } from "../../../clientapi/tasks";

interface TaskCheckboxProps {
  task: TaskWithClass;
  disabled?: boolean;
}

export default function TaskCheckbox({ task, disabled }: TaskCheckboxProps) {
  const queryClient = useQueryClient();
  const checkMutation = useMutation(
    (state: APICompleteRequest) => {
      return markTaskStatus(state.id, state.complete);
    },
    {
      onMutate: async (state) => {
        await queryClient.cancelQueries(["tasks"]);

        await queryClient.setQueriesData(
          ["tasks"],
          (oldData: TaskWithClass[] | undefined) => {
            if (!oldData) {
              return [];
            }

            return oldData.map((t) => {
              if (t.id === state.id) {
                return { ...t, complete: state.complete };
              }
              return t;
            });
          }
        );
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries(["tasks"]);
      },

      onError: async (err, state) => {
        await queryClient.invalidateQueries(["tasks"]);
        await queryClient.setQueriesData(
          ["tasks"],
          (oldData: TaskWithClass[] | undefined) => {
            if (!oldData) {
              return [];
            }

            return oldData.map((t) => {
              if (t.id === state.id) {
                return { ...t, complete: !state.complete };
              }
              return t;
            });
          }
        );
        showNotification({
          message: "Error marking task as complete",
          color: "red",
        });
      },
    }
  );

  const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    checkMutation.mutate({
      id: task.id,
      complete: event.target.checked,
    });
  };

  return (
    <Checkbox
      aria-label="Complete task"
      checked={task.complete}
      onChange={onCheck}
      disabled={disabled}
    />
  );
}
