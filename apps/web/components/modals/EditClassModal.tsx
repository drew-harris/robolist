import { Button, Stack, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { Class } from "@prisma/client";
import useClassMutation from "../../hooks/useClassMutation";
import useUser from "../../hooks/useUser";
import { InferMutationInput } from "../../utils/trpc";
import CanvasClassLink from "../input/canvas/CanvasClassLink";
import ThemeColorSelector from "../input/ThemeColorSelector";

interface EditClassModalProps {
	class: Class;
}

export default function EditClassModal({
	class: initialClass,
}: EditClassModalProps) {
	const modals = useModals();
	const { editMutation } = useClassMutation();
	const user = useUser();

	const form = useForm<InferMutationInput<"classes.edit">>({
		initialValues: {
			id: initialClass.id,
			name: initialClass.name,
			color: initialClass.color,
			canvasClassId: initialClass.canvasId,
		},
	});

	const handleColorChange = (color: string) => {
		form.setFieldValue("color", color);
	};

	async function handleSubmit(values: InferMutationInput<"classes.edit">) {
		console.log("running mutation with values", values);
		editMutation.mutate({
			id: values.id,
			name: values.name,
			color: values.color,
			canvasClassId: values.canvasClassId,
		});
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
				{user?.canvasAccount && (
					<CanvasClassLink
						value={form.values.canvasClassId || null}
						setValue={(value) => {
							form.setFieldValue("canvasClassId", value);
						}}
					/>
				)}
				<ThemeColorSelector
					value={form.values.color || "blue"}
					onChange={handleColorChange}
				/>
				<Button type="submit" color={form.values.color} size="md">
					Submit
				</Button>
				<Text>{form.values.canvasClassId}</Text>
			</Stack>
		</form>
	);
}
