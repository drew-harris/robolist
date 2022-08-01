import {
	Checkbox,
	Select,
	Space,
	Stack,
	Sx,
	Tabs,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { useContext, useEffect } from "react";
import { Settings } from "types";
import ThemeColorSelector from "../components/input/ThemeColorSelector";
import { SettingsContext } from "../contexts/SettingsContext";
import { logEvent } from "../lib/ga";
import { getUserFromJWT } from "../utils";

export default function SettingsPage() {
	const { settings, setSettings } = useContext(SettingsContext);
	const theme = useMantineTheme();

	const form = useForm<Settings>({
		initialValues: settings,
	});

	useEffect(() => {
		setSettings(form.values);
	}, [form]);

	const stackSx: Sx = (theme) => ({
		marginTop: theme.spacing.md,
		marginInline: theme.spacing.md,
		gap: theme.spacing.lg,
		maxWidth: 250,
	});

	return (
		<>
			<Title order={2}>Settings</Title>
			<Space h={theme.spacing.md} />
			<form>
				<Stack sx={stackSx}>
					<Checkbox
						label="Confetti Effect"
						{...form.getInputProps("confettiEffect")}
						checked={form.values.confettiEffect}
					/>
					<ThemeColorSelector
						value={form.values.themeColor}
						onChange={(color) => {
							logEvent("change_theme_color", {
								value: color,
							});
							form.setFieldValue("themeColor", color);
						}}
					/>
				</Stack>
				<Stack sx={stackSx}>
					<Checkbox
						label="Use Time Estimation"
						{...form.getInputProps("useTimeEstimate")}
						checked={form.values.useTimeEstimate}
					/>
					<Checkbox
						label="Use focus timer"
						{...form.getInputProps("useFocusMode")}
						checked={form.values.useFocusMode}
					/>
				</Stack>
				<Stack sx={stackSx}>
					<Select
						label="Date Picker Format"
						data={[
							{
								value: "modal",
								label: "Pop-up",
							},
							{
								value: "popover",
								label: "Dropdown",
							},
						]}
						{...form.getInputProps("datePickerFormat")}
					></Select>
					<Select
						label="First Day of Week"
						data={[
							{
								value: "sunday",
								label: "Sunday",
							},
							{
								value: "monday",
								label: "Monday",
							},
						]}
						{...form.getInputProps("firstDayOfWeek")}
					></Select>
				</Stack>
			</form>
		</>
	);
}

export function getServerSideProps(
	context: NextPageContext
): GetServerSidePropsResult<{}> {
	const jwt = getCookie("jwt", context);
	const user = getUserFromJWT(jwt?.toString());
	if (!user) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return {
		props: {}, // will be passed to the page component as props
	};
}
