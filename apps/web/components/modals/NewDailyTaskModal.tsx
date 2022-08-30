import {
	Box,
	Button,
	Checkbox,
	Group,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import useDailyMutation from "../../hooks/useDailyMutation";
import ClassIdPicker from "../input/ClassIdPicker";
import WeekdaySelector from "../input/WeekdaySelector";

interface IForm {
	title: string;
	classId: string | null;
	days: number[];
}

export default function NewDailyTaskModal() {
	const form = useForm<IForm>({
		initialValues: {
			days: [] as number[],
			title: "",
			classId: null,
		},

		validate: {
			days: (value) => (value.length < 1 ? "Must select at least 1 day" : null),
			title: (value) => (value.length < 1 ? "Title is required" : null),
		},
	});

	const { createDaily } = useDailyMutation();

	const handleSubmit = (values: IForm) => {
		try {
			createDaily.mutate({
				title: values.title,
				classId: values.classId,
				days: values.days,
			});
			closeAllModals();
		} catch (error: any) {
			showNotification({
				message: error?.message || "An error occurred",
			});
		}
	};

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Box>
				<Stack>
					<TextInput
						id="class-name-input"
						{...form.getInputProps("title")}
						label="Task Name"
					/>
					<ClassIdPicker form={form} />
				</Stack>
				<Stack mt="md" spacing={0}>
					<Group>
						<Text weight={500} size="sm">
							Select Days
						</Text>
						<Button
							onClick={() => form.setFieldValue("days", [0, 1, 2, 3, 4, 5, 6])}
							size="xs"
							variant="subtle"
						>
							All
						</Button>
						<Button
							onClick={() => form.setFieldValue("days", [])}
							size="xs"
							variant="subtle"
						>
							None
						</Button>
					</Group>
					<WeekdaySelector
						value={form.values.days}
						onChange={(nums) => form.setFieldValue("days", nums)}
					/>
					{form.errors.days && (
						<Text color="red" size="xs" weight={500}>
							{form.errors.days}
						</Text>
					)}
					<Button mt="md" fullWidth type="submit">
						Create
					</Button>
				</Stack>
			</Box>
		</form>
	);
}
