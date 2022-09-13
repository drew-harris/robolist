import { Button, LoadingOverlay, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { colorChoices } from "types";
import useUser from "../../hooks/useUser";
import { logEvent } from "../../lib/ga";
import { InferMutationInput, vanilla } from "../../utils/trpc";
import CanvasClassLink from "../input/canvas/CanvasClassLink";
import ThemeColorSelector from "../input/ThemeColorSelector";

export default function NewClassModal() {
	const [loading, setLoading] = useState(false);
	const modals = useModals();
	const queryClient = useQueryClient();

	const form = useForm<InferMutationInput<"classes.create">>({
		initialValues: {
			color: colorChoices[5],
			name: "",
			canvasClassId: null,
		},

		validate: {
			name: (name) => (name.length <= 0 ? "Name is required" : null),
		},
	});

	const user = useUser();

	const handleColorChange = (color: string) => {
		form.setFieldValue("color", color);
	};

	async function handleSubmit(values: typeof form.values) {
		console.log(values);
		setLoading(true);

		try {
			const createdClass = await vanilla.mutation("classes.create", values);
			showNotification({
				message: "Class created",
				color: "green",
			});
			queryClient.invalidateQueries(["classes"]);
			modals.closeModal("new-class");
			logEvent("create_class", {
				value: createdClass.name,
			});
		} catch (error: any) {
			showNotification({
				message: error.message,
				color: "red",
			});
			setLoading(false);
		}
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack p="sm" style={{ position: "relative" }}>
				<LoadingOverlay radius="md" visible={loading}></LoadingOverlay>
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
					value={form.values.color}
					onChange={handleColorChange}
				/>
				<Button
					type="submit"
					id="newclassmodal-submitbutton"
					color={form.values.color}
					size="md"
				>
					Submit
				</Button>
			</Stack>
		</form>
	);
}
