import { Box, Button, Stack, useMantineTheme } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import Image from "next/image";
import Link from "next/link";

export default function LinkAccountPrompt() {
	const theme = useMantineTheme();
	return (
		<Stack mx="lg" align="center">
			<Box
				sx={{
					position: "relative",
					maxWidth: "200px",
					width: "100%",
					aspectRatio: "2/1",
				}}
				mx="md"
			>
				<Image
					src={
						theme.colorScheme === "light"
							? "/assets/images/Canvas_Horizontal_ByInstructure_Black_RGB.svg"
							: "/assets/images/Canvas_Horizontal_ByInstructure_White_RGB.svg"
					}
					layout="fill"
				></Image>
			</Box>
			<Link href="/canvas/connect">
				<Button onClick={() => closeAllModals()} variant="default">
					Link Account
				</Button>
			</Link>
		</Stack>
	);
}
