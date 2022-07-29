import { useMantineColorScheme } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { useRouter } from "next/router";
import {
  Calendar,
  CalendarEvent,
  List,
  Moon2,
  Plus,
  School,
  Settings,
  TestPipe,
} from "tabler-icons-react";
import NewClassModal from "../modals/NewClassModal";
import NewTaskModal from "../modals/NewTaskModal";

interface SpotlightMenuProps {
  children: React.ReactNode;
}

export default function SpotlightMenu({ children }: SpotlightMenuProps) {
  const modals = useModals();
  const router = useRouter();
  const { toggleColorScheme } = useMantineColorScheme();

  const actions: SpotlightAction[] = [
    {
      title: "New Task",
      icon: <Plus />,
      id: "test-modal",
      keywords: ["new", "task", "create", "todo"],
      onTrigger: () => {
        modals.openModal({
          children: <NewTaskModal />,
          title: "New Task",
          id: "new-task",
          size: "lg",
        });
      },
    },
    {
      title: "New Class",
      icon: <School />,
      id: "new-class",
      keywords: ["new", "task", "create", "todo"],
      onTrigger: () => {
        modals.openModal({
          children: <NewClassModal />,
          title: "New Class",
          size: "auto",
          id: "new-class",
        });
      },
    },
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
      title: "Open Settings",
      icon: <Settings />,
      id: "settings",
      onTrigger: () => {
        router.replace("/settings/");
      },
    },
    {
      title: "Calendar",
      icon: <CalendarEvent />,
      id: "calendar",
      onTrigger: () => {
        router.replace("/calendar");
      },
    },

    {
      title: "Toggle Dark Mode",
      icon: <Moon2 />,
      id: "toggle-dark-mode",
      keywords: ["theme", "dark", "light", "switch theme"],
      onTrigger: () => {
        toggleColorScheme();
      },
    },
  ];
  return (
    <SpotlightProvider overlayBlur={0} actions={actions}>
      {children}
    </SpotlightProvider>
  );
}
