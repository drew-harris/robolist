import { useMantineColorScheme } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { useRouter } from "next/router";
import { Calendar, List, Moon2 } from "tabler-icons-react";

interface SpotlightMenuProps {
  children: React.ReactNode;
}
export default function SpotlightMenu({ children }: SpotlightMenuProps) {
  const modals = useModals();
  const router = useRouter();
  const { toggleColorScheme } = useMantineColorScheme();
  const actions: SpotlightAction[] = [
    {
      title: "Today's Tasks",
      icon: <Calendar />,
      id: "today-tasks",
      onTrigger: () => {
        router.replace("/tasks/today");
      },
    },
    {
      title: "All Tasks",
      icon: <List />,
      id: "all-tasks",
      onTrigger: () => {
        router.replace("/tasks/");
      },
    },
    {
      title: "Toggle Dark Mode",
      icon: <Moon2 />,
      id: "toggle-dark-mode",
      onTrigger: () => {
        toggleColorScheme();
      },
    },
  ];
  return <SpotlightProvider actions={actions}>{children}</SpotlightProvider>;
}
