import {
	Box,
	BoxProps,
	Divider,
	Group,
	GroupProps,
	Stack,
	Sx,
	Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface SettingProps extends BoxProps {
	title: string;
	description?: string;
	children: React.ReactNode;
	isSwitch?: boolean;
}

export default function Setting({
	title,
	description,
	children,
	isSwitch = false,
	...boxProps
}: SettingProps) {
	const isMobile = useMediaQuery("(max-width: 900px)", false);
	const groupSx: Sx = (theme) => {
		if (isSwitch && isMobile) {
			return {
				padding: theme.spacing.md,
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				gap: theme.spacing.xl,
			};
		}
		return {
			padding: theme.spacing.md,
			display: "grid",
			gridTemplateColumns: isMobile && !isSwitch ? "1fr" : "300px 2fr",
			alignItems: "center",
			gap: !isMobile ? theme.spacing.xs : 0,
		};
	};

	return (
		<>
			<Box sx={groupSx} my="xs" {...boxProps}>
				<Stack mb={isMobile && !isSwitch ? "md" : 0} spacing={0}>
					<Text weight={500}>{title}</Text>
					{description && (
						<Text size="sm" color="dimmed">
							{description}
						</Text>
					)}
				</Stack>
				<Box
					sx={{
						maxWidth: "270px",
					}}
				>
					{children}
				</Box>
			</Box>
			<Divider />
		</>
	);
}
