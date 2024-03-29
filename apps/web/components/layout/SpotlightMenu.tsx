import { useMantineColorScheme } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { useRouter } from "next/router";
import {
	Calendar,
	CalendarEvent,
	CalendarPlus,
	CalendarTime,
	Columns,
	List,
	MailFast,
	Moon2,
	Plus,
	School,
	Settings,
} from "tabler-icons-react";
import GeneralNewTaskModal from "../modals/GeneralNewTaskModal";
import NewClassModal from "../modals/NewClassModal";
import NewCustomTaskModal from "../modals/NewCustomTaskModal";
import NewDailyTaskModal from "../modals/NewDailyTaskModal";
import SendFeedbackModal from "../modals/SendFeedbackModal";

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
					children: <GeneralNewTaskModal />,
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
			title: "New Daily Task",
			icon: <CalendarPlus />,
			id: "new-daily-task",
			onTrigger: () => {
				openModal({
					children: <NewDailyTaskModal />,
					title: "New Daily Task",
					// size: "auto",
				});
			},
		},
		{
			title: "Leave Feedback",
			icon: <MailFast />,
			id: "feedback",
			onTrigger: () => {
				openModal({
					children: <SendFeedbackModal />,
					title: "Leave Feedback",
					size: "lg",
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
			title: "Details",
			icon: <Columns />,
			id: "details",
			onTrigger: () => {
				router.replace("/tasks/details");
			},
		},
		{
			title: "Daily Tasks",
			icon: <CalendarTime />,
			id: "settings",
			onTrigger: () => {
				router.replace("/daily");
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
