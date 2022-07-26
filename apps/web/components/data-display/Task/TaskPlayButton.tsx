import { ActionIcon, Loader } from "@mantine/core";
import { useContext } from "react";
import { Check, PlayerPlay } from "tabler-icons-react";
import { TaskWithClass } from "types";
import { FocusContext } from "../../../contexts/FocusContext";

interface TaskPlayButtonProps {
  task: TaskWithClass;
}

const iconSize = 18;

export default function TaskPlayButton({ task }: TaskPlayButtonProps) {
  const { focusState, fn: focusFn } = useContext(FocusContext);

  const startTask = () => {
    console.log("startTask");
    focusFn.startTask(task);
  };

  if (task.complete) {
    return <Check size={iconSize} />;
  }

  return (
    <>
      {focusState.task?.id === task.id ? (
        <Loader variant="dots" size={iconSize} />
      ) : (
        <ActionIcon onClick={startTask} size={iconSize}>
          <PlayerPlay size={iconSize} />
        </ActionIcon>
      )}
    </>
  );
}
