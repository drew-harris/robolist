import { Button, ButtonProps } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { Plus } from "tabler-icons-react";
import GeneralNewTaskModal from "../modals/GeneralNewTaskModal";
import NewCustomTaskModal from "../modals/NewCustomTaskModal";

interface NewTaskButtonProps extends ButtonProps {}

export default function NewTaskButton({ ...props }: NewTaskButtonProps) {
	const openNewTaskModal = () => {
		openModal({
			children: <GeneralNewTaskModal />,
			title: "New Task",
			size: "lg",
		});
	};
	return (
		<Button
			leftIcon={<Plus />}
			{...props}
			onClick={openNewTaskModal}
			variant={props.variant || "subtle"}
		>
			New Task
		</Button>
	);
}
