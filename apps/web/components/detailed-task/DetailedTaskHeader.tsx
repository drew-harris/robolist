import { Box, Text } from "@mantine/core";
import { gridSettings } from ".";

const Heading = ({ text }: { text: string }) => {
	return <Text weight="bold">{text}</Text>;
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
			<Heading text={"Work Date"} />
			<Heading text={"Due Date"} />
			<Heading text={"Work Time"} />
			<Box sx={{ width: 24 }}></Box>
		</Box>
	);
}
