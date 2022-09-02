import { Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { vanilla } from "../../utils/trpc";

export default function CanvasNewTaskModal() {
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

	return (
		<Stack>
			<Text>123</Text>
		</Stack>
	);
}
