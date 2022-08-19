import {
	Box,
	Button,
	LoadingOverlay,
	Stack,
	Text,
	Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { MailFast } from "tabler-icons-react";
import { trpc, vanilla } from "../../utils/trpc";

export default function SendFeedbackModal() {
	const modals = useModals();
	const form = useForm({
		initialValues: {
			text: "",
		},
	});

	const submitMutation = trpc.useMutation("feedback.create", {
		onSuccess: () => {
			showNotification({
				message: "Feedback sent",
				color: "green",
			});
			modals.closeAll();
		},

		onError: (error) => {
			showNotification({
				message: error.message,
				color: "red",
			});
		},
	});

	const submit = async (values: { text: string }) => {
		try {
			submitMutation.mutate(values.text);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Box>
			<form onSubmit={form.onSubmit(submit)}>
				<Stack sx={{ position: "relative" }}>
					<LoadingOverlay
						visible={submitMutation.status === "loading"}
						radius="md"
					/>
					<Textarea
						autosize
						minRows={2}
						placeholder="Enter your feedback here"
						{...form.getInputProps("text")}
					></Textarea>
					<Button
						sx={{
							alignSelf: "flex-end",
						}}
						variant="light"
						leftIcon={<MailFast />}
						type="submit"
					>
						Send
					</Button>
				</Stack>
			</form>
		</Box>
	);
}
