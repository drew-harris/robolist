import {
	Button,
	Select,
	Space,
	Stack,
	Switch,
	Sx,
	Tabs,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { Paint, ThreeDCubeSphere, User } from "tabler-icons-react";
import { Settings } from "types";
import ThemeColorSelector from "../components/input/ThemeColorSelector";
import Setting from "../components/small/Setting";
import { SettingsContext } from "../contexts/SettingsContext";
import { logEvent } from "../lib/ga";

export default function SettingsPage() {
	const { settings, setSettings } = useContext(SettingsContext);
	const theme = useMantineTheme();
	const queryClient = useQueryClient();
	const router = useRouter();

	const form = useForm<Settings>({
		initialValues: settings,
	});

	useEffect(() => {
		setSettings(form.values);
	}, [form, setSettings]);

	const stackSx: Sx = (theme) => ({
		marginTop: theme.spacing.md,
		marginInline: theme.spacing.md,
		gap: theme.spacing.lg,
		// maxWidth: 250,
	});

	return (
		<>
			<Title order={2}>Settings</Title>
			<Space h={theme.spacing.md} />
			<form>
				<Tabs defaultValue="appearance">
					<Tabs.List>
						<Tabs.Tab value="appearance" icon={<Paint />}>
							Appearance
						</Tabs.Tab>
						<Tabs.Tab value="behavior" icon={<ThreeDCubeSphere />}>
							Behavior
						</Tabs.Tab>
						<Tabs.Tab value="account" icon={<User />}>
							Account
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="appearance">
						<Setting
							isSwitch
							title="Confetti Effect"
							description="Shows confetti effects when tasks are completed"
						>
							<Switch
								// label="Confetti Effect"
								{...form.getInputProps("confettiEffect")}
								checked={form.values.confettiEffect}
								size="md"
							/>
						</Setting>

						<Setting title="Color Theme">
							<ThemeColorSelector
								value={form.values.themeColor}
								onChange={(color) => {
									logEvent("change_theme_color", {
										value: color,
									});
									form.setFieldValue("themeColor", color);
								}}
							/>
						</Setting>
						<Setting
							title="Date Picker Format"
							description="Controls how date selection is displayed"
						>
							<Select
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
						</Setting>
						<Setting
							description="Affects all calendar views"
							title="First Day Of The Week"
						>
							<Select
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
						</Setting>
					</Tabs.Panel>

					<Tabs.Panel value="behavior">
						<Setting
							isSwitch
							title="Time Estimation"
							description="Estimate how long tasks will take (recommended)"
						>
							<Switch
								{...form.getInputProps("useTimeEstimate")}
								checked={form.values.useTimeEstimate}
								size="md"
							/>
						</Setting>
						<Setting
							isSwitch
							title="Focus Timer"
							description="Race against the estimate and keep track of how long you've worked"
						>
							<Switch
								{...form.getInputProps("useFocusMode")}
								checked={form.values.useFocusMode}
								size="md"
							/>
						</Setting>
						<Setting
							isSwitch
							title="Daily Tasks"
							description="Schedule simple tasks on specific days"
						>
							<Switch
								size="md"
								{...form.getInputProps("useDailyTasks")}
								checked={form.values.useDailyTasks}
							/>
						</Setting>
						<Setting
							description="Blocks same-day rescheduling"
							isSwitch
							title="Strict Mode"
						>
							<Switch
								size="md"
								{...form.getInputProps("useStrictMode")}
								checked={form.values.useStrictMode}
							/>
						</Setting>
					</Tabs.Panel>
					<Tabs.Panel value="account">
						<Button
							m="lg"
							onClick={() => {
								deleteCookie("jwt");
								queryClient.removeQueries();
								router.replace("/login");
							}}
						>
							Sign Out
						</Button>
					</Tabs.Panel>
				</Tabs>
			</form>
		</>
	);
}
