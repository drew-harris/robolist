import { Box, Text } from "@mantine/core";
import { trpc } from "../../utils/trpc";

export default function CourseTestPage() {
	const { data, status } = trpc.useQuery(["canvas.courses", {}]);
	return (
		<Box>
			{data &&
				data.map((course) => (
					<Box my="lg">
						<Text>{course.course_code}</Text>
					</Box>
				))}
		</Box>
	);
}
