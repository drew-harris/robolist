import { Box, Checkbox } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APICompleteRequest, TaskWithClass } from "types";
import { markTaskStatus } from "../../../clientapi/tasks";
import Confetti, { ConfettiConfig } from "react-dom-confetti";
import { useContext, useState } from "react";
import { SettingsContext } from "../../../contexts/SettingsContext";
import { logEvent } from "../../../lib/ga";

interface TaskCheckboxProps {
  task: TaskWithClass;
  disabled?: boolean;
}

export default function TaskCheckbox({ task, disabled }: TaskCheckboxProps) {
  const { settings } = useContext(SettingsContext);
  const confettiConfig: ConfettiConfig = {
    angle: 90,
    spread: 350,
    startVelocity: 30,
    elementCount: 100,
    dragFriction: 0.12,
    duration: 1000,
    stagger: 0,
    width: "10px",
    height: "10px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  const [showConfetti, setShowConfetti] = useState(false);

  const queryClient = useQueryClient();
  const checkMutation = useMutation(
    (state: APICompleteRequest) => {
      return markTaskStatus(state.id, state.complete);
    },
    {
      onMutate: async (state) => {
        if (state.complete && settings.confettiEffect) {
          setShowConfetti(true);
        }
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
    if (event.target.checked) {
      logEvent("complete_task", {
        label: "task_component",
      });
    }
  };

  return (
    <Box>
      <Checkbox
        aria-label="Complete task"
        checked={task.complete}
        onChange={onCheck}
        disabled={disabled}
      />
      <Confetti active={showConfetti} config={confettiConfig} />
    </Box>
  );
}
