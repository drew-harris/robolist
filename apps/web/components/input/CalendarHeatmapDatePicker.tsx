import { Box, Tooltip, useMantineTheme, Text, Center } from "@mantine/core";
import { Calendar, CalendarProps, DayModifiers } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useContext, useEffect, useState } from "react";
import { DateAggregation } from "types";
import { getDateAggregation } from "../../clientapi/dates";
import { SettingsContext } from "../../contexts/SettingsContext";
import { dateIsToday, getHeatmapColor } from "../../utils/client";

interface CalendarHeatmapDatePickerProps extends CalendarProps {
	initialAggregation?: DateAggregation[];
	selectedDate: Date | null;
	onSelectDate: (date: Date | null) => void;
}

export default function CalendarHeatmapDatePicker({
	onSelectDate,
	selectedDate,
	...props
}: CalendarHeatmapDatePickerProps) {
	const { data: agg } = useQuery<DateAggregation[], Error>(
		["dates"],
		getDateAggregation
	);

	const theme = useMantineTheme();
	const { settings } = useContext(SettingsContext);

	const [maxCount, setMaxCount] = useState(0);

	// Update the maximum for gradient calculation
	useEffect(() => {
		if (!agg) {
			return;
		}
		let max = 0;
		for (const date of agg) {
			if (date._sum.workTime) {
				if (date._sum.workTime > max) {
					max = date._sum.workTime || 0;
				}
			}
		}
		setMaxCount(max);
	}, [agg]);

	const getCountOfDate = (date: Date, dates: DateAggregation[]): number => {
		for (let i = 0; i < dates.length; i++) {
			if (dates[i].workDate.getTime() === date.getTime()) {
				return dates[i]._sum.workTime || 0;
			}
		}
		return 0;
	};

	const getDateStyle = (
		date: Date,
		modifiers: DayModifiers
	): React.CSSProperties => {
		let style: React.CSSProperties = {
			backgroundColor: undefined,
		};
		if (!agg) {
			return style;
		}
		if (modifiers.disabled) {
			return style;
		}
		const count = getCountOfDate(date, agg);
		if (count) {
			style = {
				...style,
				backgroundColor: theme.fn.rgba(getHeatmapColor(count / maxCount), 0.2),
			};
		} else {
			style = {
				...style,
				backgroundColor: undefined,
			};
		}
		if (modifiers.selected) {
			style = {
				...style,
				borderWidth: 1,
				borderStyle: "solid",
				borderColor: theme.colors[theme.primaryColor][5],
			};
		}

		return style;
	};

	const getMinutesForDay = (date: Date): number | null => {
		if (!agg) {
			return null;
		}
		for (let i = 0; i < agg.length; i++) {
			if (agg[i].workDate.getTime() === date.getTime()) {
				return agg[i]._sum.workTime || 0;
			}
		}
		return null;
	};

	const getRenderDate = (date: Date): ReactNode => {
		const hours = getMinutesForDay(date);
		const isToday = dateIsToday(date);
		return (
			<Tooltip
				label={hours + " min."}
				disabled={!hours || !settings.useTimeEstimate}
				openDelay={500}
			>
				<Box
					sx={() => ({
						position: "relative",
						width: "100%",
						height: "100%",
						textDecoration: isToday ? "underline" : "none",
					})}
				>
					{date.getDate()}
				</Box>
			</Tooltip>
		);
	};

	return (
		<Calendar
			dayStyle={getDateStyle}
			value={selectedDate}
			renderDay={getRenderDate}
			firstDayOfWeek={settings.firstDayOfWeek}
			onChange={(date) => onSelectDate(date)}
			{...props}
		/>
	);
}
