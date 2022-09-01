import { Box, Paper, Text } from "@mantine/core";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

export default function CourseTestPage() {
	const { data, status } = trpc.useQuery(["canvas.list-upcoming", {}]);
	const { data: classes } = trpc.useQuery(["classes.all"]);
	return (
		<Box>
			{data &&
				classes &&
				data.map((course) => (
					<Paper p="sm" withBorder my="lg">
						<Text>{course.name}</Text>
						<Text>
							{
								classes.find((_class) => _class.canvasId === course.course_id)
									?.name
							}
						</Text>
						<Link href={course.html_url}>Open On Canvas</Link>
						<p dangerouslySetInnerHTML={{ __html: course.description }}></p>
					</Paper>
				))}
		</Box>
	);
}
