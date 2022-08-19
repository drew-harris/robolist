import { Box, Group, Paper, Skeleton } from "@mantine/core";
import { TaskOptionProps } from "../data-display/Task";

const TaskSkeleton = ({ checkbox = false, ...props }: TaskOptionProps) => {
	// random width between 100 and 200
	return (
		<Paper p="md" shadow="xs">
			<Group>
				{checkbox && <Skeleton width={20} height={20} />}
				<Box>
					<Skeleton visible={true}>AAAAAAAAAAAA</Skeleton>
				</Box>
			</Group>
		</Paper>
	);
};

export default TaskSkeleton;
