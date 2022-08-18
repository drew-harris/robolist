import { Center, Group, Stack, Title, Text } from "@mantine/core";
import Logo from "../components/small/Logo";

export default function ClosedPage() {
	const message = "Sorry, We're Closed";
	return (
		<Center
			sx={{
				height: "40vh",
			}}
		>
			<Group align="center">
				<Logo size={24} />
				<Text size={22} weight={500} ml={-9}>
					opens August 21th
				</Text>
			</Group>
		</Center>
	);
}
