import { Box, Paper, Text } from "@mantine/core";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

export default function CourseTestPage() {
	const { data, status } = trpc.useQuery(["canvas.list-upcoming", {}]);
	return (
		<Box>
			{data &&
				data.map((course) => (
					<Paper p="sm" withBorder my="lg">
						{Object.entries(course).map(([key, value]) => {
							if (typeof value === "string" && key != "description") {
								return (
									<Text mb="sm">
										{key}: {value}
									</Text>
								);
							}
						})}
					</Paper>
				))}
		</Box>
	);
}
