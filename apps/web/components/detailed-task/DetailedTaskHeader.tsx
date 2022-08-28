import { Box, Text } from "@mantine/core";
import { endSx, gridSettings } from ".";

const Heading = ({ text, end = false }: { text: string; end?: boolean }) => {
	return (
		<Text sx={end ? endSx : undefined} weight="bold">
			{text}
		</Text>
	);
};
export default function DetailedTaskHeader() {
	return (
		<Box
			sx={{
				display: "grid",
				...gridSettings,
				justifyContent: "end",
			}}
			px="md"
			mb="sm"
		>
			<Box></Box>
			<Heading text={"Title"} />
			<Heading text={"Class"} />
			<Heading end text={"Work Date"} />
			<Heading end text={"Due Date"} />
			<Heading end text={"Work Time"} />
			<Box ml="xl" sx={{ width: 64 }}></Box>
		</Box>
	);
}
