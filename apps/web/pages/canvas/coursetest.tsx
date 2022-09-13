import { Box, Paper, Text } from "@mantine/core";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

export default function CourseTestPage() {
	const { data, status } = trpc.useQuery(["canvas.list-upcoming", {}]);
	return (
		<Box>
			{data &&
				data.map((course) => (
					<Paper
						dangerouslySetInnerHTML={{ __html: course.description }}
						p="sm"
						withBorder
						my="lg"
					></Paper>
				))}
		</Box>
	);
}
