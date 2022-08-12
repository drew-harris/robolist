import { MantineColor } from "@mantine/core";

export interface Settings {
	datePickerFormat: "modal" | "popover";
	firstDayOfWeek: "sunday" | "monday";
	useTimeEstimate: boolean;
	confettiEffect: boolean;
	useFocusMode: boolean;
	themeColor: MantineColor;
	useDailyTasks: boolean;
	useStrictMode: boolean;
}
