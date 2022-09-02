import {
	Box,
	Center,
	Loader,
	Paper,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { assign } from "cypress/types/lodash";
import { TaskWithClass } from "types";
import useTaskMutation from "../../hooks/useTaskMutation";
import { trpc } from "../../utils/trpc";

interface SyncTaskModalProps {
	task: TaskWithClass;
}
export default function LinkTaskModal({ task }: SyncTaskModalProps) {
	const { data: assignments, status } = trpc.useQuery([
		"canvas.list-course-assignments",
		{ courseId: task!.class!.canvasId, excludeLinked: true },
	]);

	const { syncTaskMutation } = useTaskMutation();

	const requestSync = (assignmentId: number) => {
		if (!task.class?.canvasId) {
			return;
		}
		syncTaskMutation.mutate({
			canvasId: assignmentId,
			taskId: task.id,
			courseId: task.class.canvasId,
		});
	};

	return (
		<Stack>
			{status === "loading" && (
				<Center>
					<Loader />
				</Center>
			)}
			{assignments && assignments.length === 0 && (
				<Center>
					<Text>No assignments found</Text>
				</Center>
			)}
			{assignments?.map((assignment) => (
				<UnstyledButton>
					<Paper
						shadow="sm"
						onClick={() => requestSync(assignment.id)}
						sx={(theme) => ({
							":hover": {
								backgroundColor:
									theme.colorScheme === "dark"
										? theme.colors.dark[8]
										: theme.colors.gray[2],
							},
						})}
						p="sm"
						withBorder
					>
						{assignment.name}
					</Paper>
				</UnstyledButton>
			))}
		</Stack>
	);
}
