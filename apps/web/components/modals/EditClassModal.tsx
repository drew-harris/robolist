import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { Class } from "@prisma/client";
import { useContext, useState } from "react";
import useClassMutation from "../../hooks/useClassMutation";
import useUser from "../../hooks/useUser";
import { UserContext } from "../../pages/_app";
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
	const [connectLoading, setConnectLoading] = useState(false);

	const form = useForm<InferMutationInput<"classes.edit">>({
		initialValues: {
			id: initialClass.id,
			name: initialClass.name,
			color: initialClass.color,
		},
	});

	const handleColorChange = (color: string) => {
		form.setFieldValue("color", color);
	};

	async function handleSubmit(values: InferMutationInput<"classes.edit">) {
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
				{user?.canvasAccount && (
					<CanvasClassLink
						setLoading={setConnectLoading}
						class={initialClass}
					/>
				)}
				<ThemeColorSelector
					value={form.values.color || "blue"}
					onChange={handleColorChange}
				/>
				<Button
					type="submit"
					color={form.values.color}
					size="md"
					// loading={connectLoading}
					disabled={connectLoading}
				>
					Submit
				</Button>
			</Stack>
		</form>
	);
}
