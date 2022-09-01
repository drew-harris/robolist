import { Box, useMantineTheme } from "@mantine/core";
import Image from "next/image";

interface CanvasLogoProps {
	size?: number;
}
export default function CanvasLogo({ size = 20 }: CanvasLogoProps) {
	const theme = useMantineTheme();
	if (theme.colorScheme === "dark") {
		return (
			<Box
				sx={{
					width: size,
					height: size,
					position: "relative",
				}}
			>
				<Image
					style={{
						border: "1px solid lime",
					}}
					src="/assets/images/Canvas_Bug_White_RGB.svg"
					layout="fill"
				></Image>
			</Box>
		);
	}
	return (
		<Box sx={{ width: size, height: size, position: "relative" }}>
			<Image
				style={{
					border: "1px solid lime",
				}}
				src="/assets/images/Canvas_Bug_Black_RGB.svg"
				layout="fill"
			></Image>
		</Box>
	);
}
