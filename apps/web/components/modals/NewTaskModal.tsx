import {
	Box,
	Button,
	LoadingOverlay,
	MediaQuery,
	Stack,
	TextInput,
} from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Clock } from "tabler-icons-react";
import { APINewTaskRequest } from "types";
import { SettingsContext } from "../../contexts/SettingsContext";
import { logEvent } from "../../lib/ga";
import { trpc } from "../../utils/trpc";
import ClassIdPicker from "../input/ClassIdPicker";
import HeatmapDatePicker from "../input/HeatmapDatePicker";

export default function NewTaskModal() {
	const [loading, setLoading] = useState(false);
	const [maxDate, setMaxDate] = useState<Date | null>(null);

	const { settings } = useContext(SettingsContext);

	const modals = useModals();
	const queryClient = useQueryClient();
	const form = useForm<APINewTaskRequest>({
		initialValues: {
			classId: null,
			dueDate: null,
			workDate: null,
			title: "",
			description: null,
			workTime: null,
		},
		validate: {
			workDate: (value: Date | null | undefined, form: APINewTaskRequest) => {
				if (value && form.dueDate && value > form.dueDate) {
					return "Work date must be before due date";
				}
			},
			dueDate: (value: Date | null | undefined, form: APINewTaskRequest) => {
				if (
					value &&
					form.workDate &&
					value.getTime() < new Date(Date.now()).setHours(0, 0, 0, 0)
				) {
					return "Due date must be in the future";
				}
			},
			title: (value: string) => {
				if (value.length < 1) {
					return "Title Required";
				}
			},
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
		// Since form.errors updates after form.values, we cant watch form
		// without causing an infinite loop
		// eslint-disable-next-line
	}, [form.values]);

	const submit = async (values: APINewTaskRequest) => {
		setLoading(true);
		console.log(JSON.stringify(values));
		const response = await fetch("/api/tasks", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		if (response.ok) {
			console.log("success");
		}
		const json = await response.json();
		if (json.error) {
			console.error(json.error);
			showNotification({
				message: json.error.message,
				color: "red",
			});
			setLoading(false);
		} else {
			showNotification({
				message: "Task created",
				color: "green",
			});
			queryClient.invalidateQueries(["tasks"]);

			const trpcClient = trpc.useContext();
			trpcClient.invalidateQueries("tasks.details");
			queryClient.invalidateQueries(["dates"]);
			logEvent("create_task", {
				value: values.title,
				category: "tasks",
			});
			console.log(json.task);
			modals.closeModal("new-class");
		}
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
				<LoadingOverlay radius="sm" visible={loading} />
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
						<TextInput
							value={form.values.workTime?.toString() || ""}
							error={form.errors.workTime}
							onChange={(e) => {
								const num = parseInt(e.target.value);
								if (num === NaN) {
									form.setFieldValue("workTime", 0);
								} else {
									form.setFieldValue("workTime", num);
								}
							}}
							label="Estimated Work Time (min)"
							placeholder="Optional"
							inputMode="numeric"
							type="number"
							icon={<Clock size={18} />}
						/>
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
