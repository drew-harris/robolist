import { Box, MediaQuery, Select, Stack, TextInput } from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Clock, School } from "tabler-icons-react";
import { APINewTaskRequest } from "types";
import DemoHeatmapDatePicker from "./DemoHeatmapDatePicker";

export default function DemoNewTask() {
	const [maxDate, setMaxDate] = useState<Date | null>(null);

	const form = useForm<APINewTaskRequest>({
		initialValues: {
			classId: null,
			dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 72),
			workDate: null,
			title: "",
			description: null,
			workTime: 20,
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
		},
	});

	useEffect(() => {
		form.validateField("workDate");
		form.validateField("dueDate");
		if (form.values.title === "access") {
			setCookie("jwt", "token", { path: "/" });
		}

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

	const datePickerProps: DatePickerProps = {
		minDate: new Date(),
		firstDayOfWeek: "sunday",
		dropdownType: "popover",
		clearable: false,
		hideOutsideDates: true,
	};

	return (
		<form>
			<Stack style={{ position: "relative" }} p="sm">
				<TextInput
					placeholder="Enter a title"
					{...form.getInputProps("title")}
					label="Title"
				/>
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
						mt="sm"
					>
						<Select
							label="Class"
							placeholder="Select a class"
							icon={<School size={18}></School>}
							data={[
								{ value: "23", label: "Science" },
								{ value: "24", label: "Math" },
								{ value: "25", label: "English" },
							]}
						/>
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
						mt="sm"
					>
						<DatePicker
							style={{ flexGrow: 1 }}
							{...form.getInputProps("dueDate")}
							clearable={false}
							label="Due Date"
							{...datePickerProps}
							placeholder="Select a Date"
						/>
						<DemoHeatmapDatePicker
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
			</Stack>
		</form>
	);
}
