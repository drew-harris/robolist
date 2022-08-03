import { Center, Text, TextProps } from "@mantine/core";

interface CenterErrorProps extends TextProps {
	text?: string;
}
export default function CenterInfo({ text, ...props }: CenterErrorProps) {
	return (
		<Center>
			<Text {...props}>{text || "Error"}</Text>
		</Center>
	);
}
