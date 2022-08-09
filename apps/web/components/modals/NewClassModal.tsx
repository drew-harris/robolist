import { Button, LoadingOverlay, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { APIClassCreate } from "types";
import { colorChoices } from "types";
import { logEvent } from "../../lib/ga";
import { vanilla } from "../../utils/trpc";
import ThemeColorSelector from "../input/ThemeColorSelector";

export default function NewClassModal() {
	const [loading, setLoading] = useState(false);
	const modals = useModals();
	const queryClient = useQueryClient();

	const form = useForm<APIClassCreate>({
		initialValues: {
			color: colorChoices[5],
			name: "",
		},

		validate: {
			name: (name) => (name.length <= 0 ? "Name is required" : null),
		},
	});

	const handleColorChange = (color: string) => {
		form.setFieldValue("color", color);
	};

	async function handleSubmit(values: APIClassCreate) {
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
				value: createdClass.name
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
				<ThemeColorSelector
					value={form.values.color}
					onChange={handleColorChange}
				/>
				<Button type="submit" id="newclassmodal-submitbutton" color={form.values.color} size="md">
					Submit
				</Button>
			</Stack>
		</form>
	);
}
