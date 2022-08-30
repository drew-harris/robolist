import { Box, Group, Paper, Text } from "@mantine/core";
import { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

interface WeekdaySelectorProps {
	value: number[];
	onChange: (value: number[]) => void;
}

export default function WeekdaySelector({
	value,
	onChange,
}: WeekdaySelectorProps) {
	const options = ["S", "M", "T", "W", "T", "F", "S"];

	const toggleDay = (day: number) => {
		const newValue = value.includes(day)
			? value.filter((d) => d !== day)
			: [...value, day];
		onChange(newValue);
	};

	const { settings } = useContext(SettingsContext);

	const checkboxes = options.map((day, index) => (
		<Paper
			onClick={() => toggleDay(index)}
			sx={(theme) => {
				const backgroundColor =
					theme.colorScheme === "light"
						? theme.colors.gray[0]
						: theme.colors.gray[8];

				let textColor = theme.colorScheme === "dark" ? "white" : "black";
				if (value.includes(index)) {
					textColor = "white";
				}
				return {
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "pointer",
					backgroundColor: value.includes(index)
						? theme.colors[settings.themeColor][7]
						: backgroundColor,
					color: textColor,
				};
			}}
			withBorder
			shadow={value.includes(index) ? "none" : "sm"}
			p={2}
		>
			<Text weight="bold" size="xs">
				{day}
			</Text>
		</Paper>
	));
	return (
		<Group my="sm" grow>
			{checkboxes}
		</Group>
	);
}
