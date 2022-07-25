import { useLocalStorage } from "@mantine/hooks";
import { createContext, Dispatch, SetStateAction, useEffect } from "react";
import type { Settings } from "types";

const defaultSettings: Settings = {
  datePickerFormat: "modal",
  firstDayOfWeek: "sunday",
  useTimeEstimate: true,
  confettiEffect: true,
};

export const SettingsContext = createContext<{
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}>({
  settings: defaultSettings,
  setSettings: () => {},
});

export default function SettingsContextProvider({ children }: any) {
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
    console.log(settings);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
