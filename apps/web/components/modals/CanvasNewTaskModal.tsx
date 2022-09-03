import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
	Badge,
	Box,
	Button,
	Center,
	Group,
	Loader,
	MediaQuery,
	Paper,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { DatePickerProps } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";
import { getHumanDateString } from "../../utils/client";
import { InferQueryOutput, trpc, vanilla } from "../../utils/trpc";
import HeatmapDatePicker from "../input/HeatmapDatePicker";

interface TWorkInfoForm {
	workDate: null | Date;
	workTime: null | number;
}

export default function CanvasNewTaskModal() {
	const [parent] = useAutoAnimate<HTMLDivElement>();
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

	const getSelectedProp = (
		prop: keyof InferQueryOutput<"canvas.list-upcoming">[0]
	) => {
		if (!selectedAssignment || !upcomingAssignments) {
			return null;
		}

		const assignment = upcomingAssignments.find(
			(a) => a.id === selectedAssignment
		);

		if (!assignment) {
			return null;
		}
		if (prop === "due_at") {
			if (!assignment?.due_at) {
				return null;
			}
			return new Date(assignment?.due_at).setHours(0, 0, 0, 0);
		}
		return assignment[prop];
	};

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
	});

	const [page, setPage] = useState<number>(0);

	const [selectedAssignment, setSelectedAssignment] = useState<number | null>(
		null
	);

	if (!upcomingAssignments || !classes) {
		return (
			<Center mb="xl" mt={43}>
				<Loader />
			</Center>
		);
	}

	return (
		<Stack m="md" ref={parent}>
			{upcomingAssignments.map((assignment) => {
				if (selectedAssignment && selectedAssignment != assignment.id) {
					return null;
				}
				return (
					<AssignmentChoice
						selectedAssignment={selectedAssignment}
						assignment={assignment}
						setSelectedAssignment={setSelectedAssignment}
						classes={classes}
					/>
				);
			})}
			{selectedAssignment && [
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
					>
						<TextInput label="Work Time"></TextInput>
						<HeatmapDatePicker clearable={false} />
					</Box>
				</MediaQuery>,
				<Button mt="sm">Submit</Button>,
			]}
		</Stack>
	);
}

interface AssignmentChoiceProps {
	assignment: InferQueryOutput<"canvas.list-upcoming">[0];
	classes: InferQueryOutput<"classes.all">;
	setSelectedAssignment: (id: number | null) => void;
	selectedAssignment: number | null;
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
				if (selectedAssignment === assignment.id) {
					setSelectedAssignment(null);
				} else {
					setSelectedAssignment(assignment.id);
				}
			}}
			withBorder
			shadow="sm"
			p="sm"
			sx={(theme) => ({
				backgroundColor:
					theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
			})}
		>
			<Group position="apart">
				<Group>
					<Text>{assignment.name}</Text>
					<Badge color={matchingClass.color}>{matchingClass.name}</Badge>
				</Group>
				<Text size="sm" color="dimmed">
					Due {getHumanDateString(new Date(assignment.due_at))}
				</Text>
			</Group>
		</Paper>
	);
};
