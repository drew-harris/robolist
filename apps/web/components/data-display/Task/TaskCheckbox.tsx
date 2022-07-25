import { Box, Checkbox } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APICompleteRequest, TaskWithClass } from "types";
import { markTaskStatus } from "../../../clientapi/tasks";
import Confetti from "react-dom-confetti";
import { useContext, useState } from "react";
import { SettingsContext } from "../../../contexts/SettingsContext";

interface TaskCheckboxProps {
  task: TaskWithClass;
  disabled?: boolean;
}

export default function TaskCheckbox({ task, disabled }: TaskCheckboxProps) {
  const { settings } = useContext(SettingsContext);
  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 32,
    elementCount: 51,
    dragFriction: 0.12,
    duration: 1010,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
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
