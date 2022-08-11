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
import { DailyWithClass } from "types";
import useDailyMutation from "../../hooks/useDailyMutation";
import ClassIdPicker from "../input/ClassIdPicker";

interface IForm {
	title: string;
	classId: string | null;
	days: string[];
}

interface EditDailyTaskModalProps {
	task: DailyWithClass;
}

export default function EditDailyTaskModal({
	task: initialTask,
}: EditDailyTaskModalProps) {
	const form = useForm<IForm>({
		initialValues: {
			days: initialTask.days.map((num: number) => num.toString()),
			title: initialTask.title,
			classId: initialTask.classId,
		},

		validate: {
			days: (value) => (value.length < 1 ? "Must select at least 1 day" : null),
			title: (value) => (value.length < 1 ? "Title is required" : null),
		},
	});

	const { editDaily } = useDailyMutation();

	const makeCheckboxes = (): JSX.Element[] => {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		return days.map((day, index) => (
			<Checkbox value={index.toString()} key={day} label={day} />
		));
	};

	const handleSubmit = (values: IForm) => {
		const numberDays = values.days.map((day) => parseInt(day)).sort();
		try {
			editDaily.mutate({
				id: initialTask.id,
				title: values.title,
				classId: values.classId,
				days: numberDays,
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
							onClick={() =>
								form.setFieldValue("days", ["0", "1", "2", "3", "4", "5", "6"])
							}
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
					<Checkbox.Group
						sx={{ padding: 0, margin: 0 }}
						{...form.getInputProps("days")}
					>
						{makeCheckboxes()}
					</Checkbox.Group>
					<Button mt="md" fullWidth type="submit">
						Save
					</Button>
				</Stack>
			</Box>
		</form>
	);
}
