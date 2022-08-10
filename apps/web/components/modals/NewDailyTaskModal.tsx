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
import { ModalsContext } from "@mantine/modals/lib/context";
import { showNotification } from "@mantine/notifications";
import useDailyMutation from "../../hooks/useDailyMutation";
import ClassIdPicker from "../input/ClassIdPicker";

interface IForm {
	title: string;
	classId: string | null;
	days: string[];
}

export default function NewDailyTaskModal() {
	const form = useForm<IForm>({
		initialValues: {
			days: [],
			title: "",
			classId: null,
		},

		validate: {
			days: (value) => (value.length < 1 ? "Must select at least 1 day" : null),
			title: (value) => (value.length < 1 ? "Title is required" : null),
		},
	});

	const { createDaily } = useDailyMutation();

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
			createDaily.mutate({
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
						Create
					</Button>
				</Stack>
			</Box>
		</form>
	);
}
