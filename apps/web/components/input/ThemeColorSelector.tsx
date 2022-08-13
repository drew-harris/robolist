import { ColorSwatch, Group, GroupProps, useMantineTheme } from "@mantine/core";
import { colorChoices } from "types";

interface ThemeColorSelectorProps {
	value: string;
	onChange: (color: string) => void;
}

export default function ThemeColorSelector(props: ThemeColorSelectorProps) {
	const swatchElements = colorChoices.map((color: string) => (
		<Swatch
			key={color}
			selected={props.value}
			color={color}
			onSelect={props.onChange}
		></Swatch>
	));

	return <Group>{swatchElements}</Group>;
}

interface SwatchProps {
	color: string;
	selected: string;
	onSelect: (color: string) => void;
}

const Swatch = (props: SwatchProps) => {
	const theme = useMantineTheme();
	const borderColor = theme.colorScheme === "dark" ? theme.white : theme.black;
	return (
		<ColorSwatch
			style={{
				borderWidth: props.selected == props.color ? 3 : 0,
				borderColor,
				borderStyle: "solid",
			}}
			color={theme.colors[props.color][6]}
			onClick={() => {
				props.onSelect(props.color);
			}}
		></ColorSwatch>
	);
};
