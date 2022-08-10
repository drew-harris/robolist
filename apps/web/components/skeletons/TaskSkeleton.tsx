import { Box, Group, Paper, Skeleton } from "@mantine/core";
import React from "react";
import { TaskOptionProps } from "../data-display/Task";

const TaskSkeleton = ({ checkbox = false, ...props }: TaskOptionProps) => {
	const [fakeTitle] = React.useState(
		"a".repeat(Math.floor(Math.random() * 10) + 8)
	);

	// random width between 100 and 200
	return (
		<Paper p="md" shadow="xs">
			<Group>
				{checkbox && <Skeleton width={20} height={20} />}
				<Box>
					<Skeleton visible={true}>{fakeTitle}</Skeleton>
				</Box>
			</Group>
		</Paper>
	);
};

export default TaskSkeleton;
