import { Box, Container, ScrollArea, Stack, Title } from "@mantine/core";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { useContext, useState } from "react";
import { DateAggregation } from "types";
import DateTaskContainer from "../../components/containers/DateTaskContainer";
import CalendarHeatmapDatePicker from "../../components/input/CalendarHeatmapDatePicker";
import { SettingsContext } from "../../contexts/SettingsContext";
import { getDates } from "../../serverapi/dates";
import { getUserFromJWT } from "../../utils";

interface CalendarPageProps {
	aggregation: DateAggregation[];
}

export default function CalendarPage({
	aggregation: initialAggregation,
}: CalendarPageProps) {
	const { settings } = useContext(SettingsContext);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
					initialAggregation={initialAggregation}
					firstDayOfWeek={settings.firstDayOfWeek}
					fullWidth
					selectedDate={selectedDate}
					onSelectDate={setSelectedDate}
				/>
			</Container>
			{selectedDate && <DateTaskContainer date={selectedDate} />}
		</Box>
	);
}

export async function getServerSideProps(
	context: NextPageContext
): Promise<GetServerSidePropsResult<CalendarPageProps>> {
	const jwt = getCookie("jwt", context);
	const user = getUserFromJWT(jwt?.toString());
	if (!user) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	const dates = await getDates(user);

	return {
		props: {
			aggregation: dates,
		},
	};
}
