import { Center, Group, Text } from "@mantine/core";
import Logo from "../components/small/Logo";

export default function ClosedPage() {
	return (
		<Center
			sx={{
				height: "40vh",
			}}
		>
			<Group position="center">
				<Logo size={24} />
				<Text size={22} weight={500} ml={-9}>
					opens August 21st
				</Text>
			</Group>
		</Center>
	);
}
