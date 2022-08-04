import {
	ActionIcon,
	Group,
	MantineTheme,
	Menu,
	Paper,
	Sx,
	Text,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Class } from "@prisma/client";
import { Dots, Pencil, Trash } from "tabler-icons-react";
import useClassMutation from "../../hooks/useClassMutation";
import EditClassModal from "../modals/EditClassModal";

interface ClassSquareProps {
	class: Class;
}

const ClassSquare = (props: ClassSquareProps) => {
	const modals = useModals();
	const { deleteMutation } = useClassMutation();
	const squareSx: Sx = (theme: MantineTheme) => ({
		backgroundColor:
			theme.colorScheme == "dark"
				? theme.fn.darken(theme.colors[props.class.color][8], 0.5)
				: theme.colors[props.class.color][4],
		padding: theme.spacing.lg,
		borderRadius: theme.radius.sm,
		fontWeight: 600,
	});

	const handleDelete = () => {
		modals.openConfirmModal({
			title: "Delete Task?",
			onConfirm: () => {
				deleteMutation.mutate(props.class.id);
			},
			children: (
				<Text size="sm">
					Are you sure you want to delete this class? Your tasks labeled with
					this class will be saved.
				</Text>
			),
			labels: {
				confirm: "Delete",
				cancel: "Cancel",
			},
			confirmProps: {
				color: "red",
			},
		});
	};

	const handleEdit = () => {
		modals.openModal({
			title: "Edit Task",
			children: <EditClassModal class={props.class} />,
			size: "auto",
		});
	};

	return (
		<Paper sx={squareSx} shadow="md">
			<Group position="apart">
				{props.class.name}
				<Menu>
					<Menu.Target>
						<ActionIcon size="sm">
							<Dots />
						</ActionIcon>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item onClick={handleEdit} icon={<Pencil />}>
							Edit
						</Menu.Item>
						<Menu.Item onClick={handleDelete} color="red" icon={<Trash />}>
							Delete
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
		</Paper>
	);
};

export default ClassSquare;
