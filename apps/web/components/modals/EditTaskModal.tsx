import { Box, Button, MediaQuery, Stack, TextInput } from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { useContext, useEffect, useState } from "react";
import { Clock } from "tabler-icons-react";
import { TaskWithClass } from "types";
import { SettingsContext } from "../../contexts/SettingsContext";
import useTaskMutation from "../../hooks/useTaskMutation";
import ClassIdPicker from "../input/ClassIdPicker";
import HeatmapDatePicker from "../input/HeatmapDatePicker";

interface EditTaskModalProps {
	task: TaskWithClass;
}

export default function EditTaskModal({
	task: initialTask,
}: EditTaskModalProps) {
	const [maxDate, setMaxDate] = useState<Date | null>(null);

	const { settings } = useContext(SettingsContext);

	const modals = useModals();
	const { editMutation } = useTaskMutation();
	const form = useForm<Partial<TaskWithClass>>({
		initialValues: {
			...initialTask,
			classId: initialTask?.class?.id || null,
		},
	});

	useEffect(() => {
		form.validateField("workDate");
		form.validateField("dueDate");

		if (form.values.dueDate) {
			// If due date is today, set it to tomorrow
			const today = new Date(Date.now());
			today.setHours(0, 0, 0, 0);

			if (form.values.dueDate.getTime() === today.getTime()) {
				setMaxDate(new Date(form.values.dueDate.getTime()));
			} else {
				setMaxDate(
					new Date(form.values.dueDate.getTime() - 24 * 60 * 60 * 999)
				);
			}
		}
	}, [form.values]);

	const submit = async (values: Partial<TaskWithClass>) => {
		editMutation.mutate(values);
		modals.closeAll();
	};

	const datePickerProps: DatePickerProps = {
		minDate: new Date(),
		firstDayOfWeek: settings.firstDayOfWeek,
		dropdownType: settings.datePickerFormat,
		clearable: false,
		hideOutsideDates: true,
	};

	return (
		<form onSubmit={form.onSubmit(submit)}>
			<Stack style={{ position: "relative" }} p="sm">
				<TextInput {...form.getInputProps("title")} label="Title" />
				<MediaQuery
					smallerThan={"xs"}
					styles={{ flexDirection: "column", display: "flex" }}
				>
					<Box
						sx={(theme) => ({
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: theme.spacing.md,
						})}
						mt="lg"
					>
						<ClassIdPicker form={form} />
						{settings.useTimeEstimate && (
							<TextInput
								value={form.values.workTime?.toString() || ""}
								onChange={(e) => {
									const num = parseInt(e.target.value);
									if (num === NaN) {
										form.setFieldValue("workTime", 0);
									} else {
										form.setFieldValue("workTime", num);
									}
								}}
								label="Estimated Work Time (minutes)"
								inputMode="numeric"
								type="number"
								min={0}
								icon={<Clock size={18} />}
							/>
						)}
					</Box>
				</MediaQuery>
				<MediaQuery smallerThan={"xs"} styles={{ flexDirection: "column" }}>
					<Box
						sx={(theme) => ({
							display: "flex",
							gap: theme.spacing.md,
						})}
						mt="lg"
					>
						<DatePicker
							style={{ flexGrow: 1 }}
							{...form.getInputProps("dueDate")}
							clearable={false}
							label="Due Date"
							{...datePickerProps}
							placeholder="Select a Date"
						/>
						<HeatmapDatePicker
							style={{ flexGrow: "1" }}
							{...form.getInputProps("workDate")}
							clearable={false}
							disabled={!form.values.dueDate}
							maxDate={maxDate}
							{...datePickerProps}
							placeholder={
								form.values.dueDate
									? "Select a Date"
									: "Select a Due Date First"
							}
						/>
					</Box>
				</MediaQuery>
				<Button mt="md" type="submit">
					Submit
				</Button>
			</Stack>
		</form>
	);
}
