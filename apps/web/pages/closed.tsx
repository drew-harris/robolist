import { Center, Stack, Title } from "@mantine/core";
import { MoodSad } from "tabler-icons-react";

export default function ClosedPage() {
	const message = "Sorry, We're Closed";
	return (
		<Center
			sx={{
				height: "40vh",
			}}
		>
			<Stack align="center">
				<MoodSad size={40} />
				<Title order={2}>{message}</Title>
			</Stack>
		</Center>
	);
}
