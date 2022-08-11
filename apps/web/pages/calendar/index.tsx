import { Box, Container, Title } from "@mantine/core";
import { useContext, useState } from "react";
import DateTaskContainer from "../../components/containers/DateTaskContainer";
import CalendarHeatmapDatePicker from "../../components/input/CalendarHeatmapDatePicker";
import CenterInfo from "../../components/small/CenterInfo";
import { SettingsContext } from "../../contexts/SettingsContext";
import useInitialPrefetch from "../../hooks/useInitialPrefetch";

export default function CalendarPage() {
	const { settings } = useContext(SettingsContext);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	useInitialPrefetch();
	return (
		<Box
			sx={(theme) => ({
				display: "flex",
				flexDirection: "column",
				gap: theme.spacing.lg,
			})}
		>
			<Title order={2}>Calendar</Title>
			<Container
				sx={(theme) => ({
					maxWidth: theme.breakpoints.sm,
					gap: theme.spacing.lg,
				})}
			>
				<CalendarHeatmapDatePicker
					hideOutsideDates
					firstDayOfWeek={settings.firstDayOfWeek}
					fullWidth
					selectedDate={selectedDate}
					onSelectDate={setSelectedDate}
				/>
			</Container>
			{!selectedDate && (
				<CenterInfo mt="xl" text="Select a date to see tasks" />
			)}
			{selectedDate && (
				<DateTaskContainer
					rescheduleButton
					menu={{ delete: true, edit: true }}
					date={selectedDate}
				/>
			)}
		</Box>
	);
}
