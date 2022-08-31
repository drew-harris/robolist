import {
	Box,
	Group,
	MantineTheme,
	Paper,
	Skeleton,
	Sx,
	Text,
	useMantineTheme,
} from "@mantine/core";

export default function ClassSkeleton() {
	const squareSx: Sx = (theme: MantineTheme) => ({
		// backgroundColor:
		// 	theme.colorScheme == "dark"
		// 		? theme.fn.darken(theme.colors[props.class.color][8], 0.9)
		// 		: theme.colors[props.class.color][4],
		padding: theme.spacing.lg,
		borderRadius: theme.radius.sm,
		fontWeight: 600,
	});
	const theme = useMantineTheme();
	return (
		<Paper sx={squareSx} withBorder shadow="md">
			<Group
				sx={{
					overflow: "hidden",
				}}
				position="apart"
			>
				<Group>
					<Skeleton height={theme.spacing.lg} circle />
					<Box>
						<Skeleton visible={true}>
							<Text>isasldifjasldifjdifjsdf</Text>
						</Skeleton>
					</Box>
				</Group>
			</Group>
		</Paper>
	);
}
