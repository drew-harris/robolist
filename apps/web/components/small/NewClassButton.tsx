import { Button, ButtonProps } from "@mantine/core";
import { openModal } from "@mantine/modals";
import NewClassModal from "../modals/NewClassModal";

interface NewClassButtonProps extends ButtonProps {

}

export default function NewClassButton({ ...props }: NewClassButtonProps) {
  const openNewClassModal = () => {
    openModal({
      children: <NewClassModal />,
      title: "New Class",
      size: "auto",
    });
  }
  return <Button id="newclassbutton" {...props} onClick={openNewClassModal} variant={props.variant || "subtle"}>New Class</Button>
}