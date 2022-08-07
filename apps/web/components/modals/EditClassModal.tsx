import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { Class } from "@prisma/client";
import useClassMutation from "../../hooks/useClassMutation";
import ThemeColorSelector from "../input/ThemeColorSelector";

interface EditClassModalProps {
	class: Class;
}

export default function EditClassModal({
	class: initialClass,
}: EditClassModalProps) {
	const modals = useModals();
	const { editMutation } = useClassMutation();

	const form = useForm<Partial<Class>>({
		initialValues: {
			id: initialClass.id,
			name: initialClass.name,
			color: initialClass.color,
		},
	});

	const handleColorChange = (color: string) => {
		form.setFieldValue("color", color);
	};

	async function handleSubmit(values: Partial<Class>) {
		editMutation.mutate(values);
		modals.closeAll();
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack p="sm" style={{ position: "relative" }}>
				<TextInput
					id="class-name-input"
					{...form.getInputProps("name")}
					label="Class Name"
				/>
				<ThemeColorSelector
					value={form.values.color || "blue"}
					onChange={handleColorChange}
				/>
				<Button type="submit" color={form.values.color} size="md">
					Submit
				</Button>
			</Stack>
		</form>
	);
}
