import { Button, ButtonProps } from "@mantine/core";
import { openModal, useModals } from "@mantine/modals";
import NewTaskModal from "../modals/NewTaskModal";

interface NewTaskButtonProps extends ButtonProps {

}

export default function NewTaskButton({ ...props }: NewTaskButtonProps) {
  const openNewTaskModal = () => {
    openModal({
      children: <NewTaskModal />,
      title: "New Task",
      size: "lg",
    });
  }
  return <Button {...props} onClick={openNewTaskModal} variant={props.variant || "subtle"}>New Task</Button>
}