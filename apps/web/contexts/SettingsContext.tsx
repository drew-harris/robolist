import { MantineColor } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { setCookie } from "cookies-next";
import { createContext, useEffect } from "react";
import type { Settings } from "types";

const defaultSettings: Settings = {
	datePickerFormat: "modal",
	firstDayOfWeek: "sunday",
	useTimeEstimate: true,
	confettiEffect: true,
	useFocusMode: false,
	themeColor: "blue",
	useStrictMode: false,
	useDailyTasks: true,
};

export const SettingsContext = createContext<{
	settings: Settings;
	setSettings: (settings: Settings) => void;
}>({
	settings: defaultSettings,
	setSettings: () => {},
});

interface SettingsContextProviderProps {
	onColorChange: (color: MantineColor) => void;
	children: React.ReactNode;
	ssrSettings: Partial<Settings> | null;
}
export default function SettingsContextProvider({
	children,
	onColorChange,
	ssrSettings,
}: SettingsContextProviderProps) {
	const [settings, setRawSettings] = useLocalStorage<Settings>({
		key: "settings",
		serialize: (settings) => JSON.stringify(settings),
		deserialize: (str) => {
			try {
				return JSON.parse(str);
			} catch (e) {
				return defaultSettings;
			}
		},
		defaultValue: { ...defaultSettings, ...ssrSettings },
	});

	useEffect(() => {
		if (settings.themeColor) {
			onColorChange(settings.themeColor);
		}
	}, [onColorChange, settings.themeColor]);

	const setSettings = (newSettings: Settings) => {
		setRawSettings(newSettings);
		setCookie("settings", JSON.stringify(newSettings));
	};

	return (
		<SettingsContext.Provider value={{ settings, setSettings }}>
			{children}
		</SettingsContext.Provider>
	);
}
