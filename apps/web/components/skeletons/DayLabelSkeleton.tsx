import { Group, Title, Text, Skeleton, Box } from "@mantine/core";

export default function DayLabelSkeleton() {
	return (
		<Group>
			<Box>
				<Skeleton visible={true}>
					<Title order={4}>AAAAAAAAAAAA</Title>
				</Skeleton>
			</Box>
			<Box>
				<Skeleton visible={true}>
					<Text color="dimmed">AAA</Text>
				</Skeleton>
			</Box>
		</Group>
	);
}
