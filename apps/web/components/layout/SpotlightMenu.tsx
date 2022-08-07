import { useMantineColorScheme } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { useRouter } from "next/router";
import {
	Calendar,
	CalendarEvent,
	List,
	Moon2,
	Plus,
	School,
	Settings
} from "tabler-icons-react";
import NewClassModal from "../modals/NewClassModal";
import NewTaskModal from "../modals/NewTaskModal";

interface SpotlightMenuProps {
	children: React.ReactNode;
}

export default function SpotlightMenu({ children }: SpotlightMenuProps) {
	const router = useRouter();
	const { toggleColorScheme } = useMantineColorScheme();

	const actions: SpotlightAction[] = [
		{
			title: "New Task",
			icon: <Plus />,
			id: "test-modal",
			keywords: ["new", "task", "create", "todo"],
			onTrigger: () => {
				openModal({
					children: <NewTaskModal />,
					title: "New Task",
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
				openModal({
					children: <NewClassModal />,
					title: "New Class",
					size: "auto",
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
				router.replace("/tasks");
			},
		},
		{
			title: "Settings",
			icon: <Settings />,
			id: "settings",
			onTrigger: () => {
				router.replace("/settings");
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
