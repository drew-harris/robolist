import { MantineColor } from "@mantine/core";

export interface Settings {
	datePickerFormat: "modal" | "popover";
	firstDayOfWeek: "sunday" | "monday";
	confettiEffect: boolean;
	useFocusMode: boolean;
	themeColor: MantineColor;
	useDailyTasks: boolean;
	useStrictMode: boolean;
}
