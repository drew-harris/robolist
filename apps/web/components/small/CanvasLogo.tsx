import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import Image from "next/image";

interface CanvasLogoProps extends BoxProps {
	size?: number | "fill";
}
export default function CanvasLogo({
	size = 20,
	...boxProps
}: CanvasLogoProps) {
	const theme = useMantineTheme();
	if (theme.colorScheme === "dark") {
		return (
			<Box
				{...boxProps}
				sx={{
					width: size !== "fill" ? size : "100%",
					height: size != "fill" ? size : "100%",
					position: "relative",
					display: "grid",
					placeItems: "center",
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
		<Box
			{...boxProps}
			sx={{
				width: size != "fill" ? size : "100%",
				height: size != "fill" ? size : "100%",
				display: "grid",
				placeItems: "center",
				position: "relative",
			}}
		>
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
