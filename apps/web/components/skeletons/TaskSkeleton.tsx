import { Box, Group, Paper, Skeleton } from "@mantine/core";
import { TaskOptionProps } from "../data-display/Task";

const TaskSkeleton = ({ checkbox = false, ...props }: TaskOptionProps) => {
	return (
		<Paper p="md" withBorder shadow="xs">
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
