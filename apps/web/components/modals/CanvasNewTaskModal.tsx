import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Center,
	Group,
	Loader,
	LoadingOverlay,
	MediaQuery,
	NumberInput,
	Paper,
	Stack,
	Text,
} from "@mantine/core";
import { DatePickerProps } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Assignment } from "canvas-api-ts/dist/api/responseTypes";
import { useContext, useState } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";
import { getHumanDateString } from "../../utils/client";
import { InferQueryOutput, trpc, vanilla } from "../../utils/trpc";
import HeatmapDatePicker from "../input/HeatmapDatePicker";
import CanvasLogo from "../small/CanvasLogo";
import OpenOnCanvasButton from "../small/OpenOnCanvasButton";

interface TWorkInfoForm {
	workDate: null | Date;
	workTime: null | number;
}

export default function CanvasNewTaskModal() {
	const [parent] = useAutoAnimate<HTMLDivElement>();
	const isMobile = useMediaQuery("(max-width: 900px)", false);
	const queryClient = useQueryClient();
	const {
		data: upcomingAssignments,
		status,
		error,
	} = useQuery(["upcoming-assignments"], () => {
		return vanilla.query("canvas.list-upcoming", { excludeAdded: true });
	});

	const {
		data: classes,
		status: classesStatus,
		error: classesError,
	} = useQuery(["classes"], () => {
		return vanilla.query("classes.all");
	});

	const addTaskMutation = trpc.useMutation("tasks.create");

	const { settings } = useContext(SettingsContext);
	const datePickerProps: DatePickerProps = {
		minDate: new Date(),
		firstDayOfWeek: settings.firstDayOfWeek,
		dropdownType: settings.datePickerFormat,
		clearable: false,
		hideOutsideDates: true,
	};

	const workInfoForm = useForm<TWorkInfoForm>({
		initialValues: {
			workDate: null,
			workTime: null,
		},

		validate: {
			// Worktime must be positive
			workTime: (value: number) => {
				if (value && value <= 0) {
					return "Work time must be positive";
				}
			},
		},
	});

	const [page, setPage] = useState<number>(0);

	const [selectedAssignment, setSelectedAssignment] = useState<
		InferQueryOutput<"canvas.list-upcoming">[0] | null
	>(null);

	const submit = async (values: TWorkInfoForm) => {
		console.log(values);
		if (!selectedAssignment || !upcomingAssignments) {
			return;
		}
		if (!values.workDate) {
			return;
		}

		if (!selectedAssignment.due_at) {
			return;
		}

		const dueDate = new Date(selectedAssignment.due_at);
		dueDate.setHours(0, 0, 0, 0);

		addTaskMutation.mutate(
			{
				canvasDescription: selectedAssignment.description,
				canvasId: selectedAssignment.id,
				canvasName: selectedAssignment.name,
				workDate: values.workDate,
				workTime: values.workTime || null,
				canvasURL: selectedAssignment.html_url,
				dueDate: dueDate,
				title: selectedAssignment.name,
				classId:
					classes?.find((c) => c.canvasId === selectedAssignment.course_id)
						?.id || null,
			},
			{
				onSettled: () => {
					queryClient.invalidateQueries(["tasks"]);
					queryClient.refetchQueries(["upcoming-assignments"]);
					closeAllModals();
				},
				onError: ({ message }) => {
					showNotification({
						message: message,
					});
				},
			}
		);
	};

	if (!upcomingAssignments || !classes) {
		return (
			<Center mb="xl" mt={43}>
				<Loader />
			</Center>
		);
	}
	const maxDate = selectedAssignment?.due_at
		? new Date(selectedAssignment.due_at)
		: null;
	if (maxDate) {
		maxDate.setDate(maxDate.getDate() - 1);
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return (
		<Stack mt="md" m={isMobile ? 0 : "md"} ref={parent}>
			<LoadingOverlay
				key="loading"
				visible={addTaskMutation.status === "loading"}
			/>
			{upcomingAssignments.length === 0 && (
				<Center mt="md" key="nowarning">
					<Text>You have no upcoming assignments</Text>
				</Center>
			)}
			{upcomingAssignments.map((assignment) => {
				if (selectedAssignment && selectedAssignment.id != assignment.id) {
					return null;
				}
				return (
					<AssignmentChoice
						key={assignment.id}
						selectedAssignment={selectedAssignment}
						assignment={assignment}
						setSelectedAssignment={(assignment) => {
							setSelectedAssignment(assignment);
							workInfoForm.reset();
						}}
						classes={classes}
					/>
				);
			})}
			{selectedAssignment && [
				<form key="submit" onSubmit={workInfoForm.onSubmit(submit)}>
					<MediaQuery
						key="workinfo"
						smallerThan={"xs"}
						styles={{ flexDirection: "column", display: "flex" }}
					>
						<Box
							sx={(theme) => ({
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: theme.spacing.md,
							})}
						>
							<NumberInput
								{...workInfoForm.getInputProps("workTime")}
								label="Work Time"
								placeholder="Optional"
							></NumberInput>
							<HeatmapDatePicker
								clearable={false}
								{...workInfoForm.getInputProps("workDate")}
								maxDate={maxDate}
								minDate={today}
								placeholder="Select a date"
							/>
						</Box>
					</MediaQuery>
					<Button
						disabled={!workInfoForm.values.workDate}
						type="submit"
						fullWidth
						mt="sm"
					>
						Submit
					</Button>
				</form>,
			]}
		</Stack>
	);
}

interface AssignmentChoiceProps {
	assignment: InferQueryOutput<"canvas.list-upcoming">[0];
	classes: InferQueryOutput<"classes.all">;
	setSelectedAssignment: (assignment: Assignment | null) => void;
	selectedAssignment: InferQueryOutput<"canvas.list-upcoming">[0] | null;
}

const AssignmentChoice = ({
	assignment,
	classes,
	setSelectedAssignment,
	selectedAssignment,
}: AssignmentChoiceProps) => {
	const matchingClass =
		classes.find((c) => c.canvasId === assignment.course_id) || null;

	if (!matchingClass) {
		return null;
	}

	return (
		<Paper
			onClick={() => {
				if (selectedAssignment && selectedAssignment.id === assignment.id) {
					setSelectedAssignment(null);
				} else {
					setSelectedAssignment(assignment);
				}
			}}
			withBorder
			shadow="sm"
			p="sm"
			sx={(theme) => ({
				backgroundColor:
					theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
				cursor: "pointer",
			})}
		>
			<Group position="apart">
				<Group>
					<Text>{assignment.name}</Text>
					<Badge color={matchingClass.color}>{matchingClass.name}</Badge>
				</Group>
				<Group>
					<Text size="sm" color="dimmed">
						Due {getHumanDateString(new Date(assignment.due_at))}
					</Text>
					<OpenOnCanvasButton url={assignment.html_url} />
				</Group>
			</Group>
		</Paper>
	);
};
