import { MantineColor } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { createContext, Dispatch, SetStateAction, useEffect } from "react";
import type { Settings } from "types";

const defaultSettings: Settings = {
	datePickerFormat: "modal",
	firstDayOfWeek: "sunday",
	useTimeEstimate: true,
	confettiEffect: true,
	useFocusMode: false,
	themeColor: "blue",
};

export const SettingsContext = createContext<{
	settings: Settings;
	setSettings: Dispatch<SetStateAction<Settings>>;
}>({
	settings: defaultSettings,
	setSettings: () => { },
});

interface SettingsContextProviderProps {
	onColorChange: (color: MantineColor) => void;
	children: React.ReactNode;
}
export default function SettingsContextProvider({
	children,
	onColorChange,
}: SettingsContextProviderProps) {
	const [settings, setSettings] = useLocalStorage<Settings>({
		key: "settings",
		serialize: (settings) => JSON.stringify(settings),
		deserialize: (str) => {
			try {
				return JSON.parse(str);
			} catch (e) {
				return defaultSettings;
			}
		},
		defaultValue: defaultSettings,
	});

	useEffect(() => {
		if (settings.themeColor) {
			onColorChange(settings.themeColor);
		}
	}, [onColorChange, settings.themeColor]);

	return (
		<SettingsContext.Provider value={{ settings, setSettings }}>
			{children}
		</SettingsContext.Provider>
	);
}
