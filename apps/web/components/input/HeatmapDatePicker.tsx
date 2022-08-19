import { Box, Text, Tooltip, useMantineTheme } from "@mantine/core";
import { DatePicker, DatePickerProps, DayModifiers } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useContext, useEffect, useState } from "react";
import { DateAggregation } from "types";
import { getDateAggregation } from "../../clientapi/dates";
import { SettingsContext } from "../../contexts/SettingsContext";
import { dateIsToday, getHeatmapColor } from "../../utils/client";

export default function HeatmapDatePicker(props: DatePickerProps) {
	const { data: agg } = useQuery<DateAggregation[], Error>(
		["dates"],
		getDateAggregation
	);
	const { settings } = useContext(SettingsContext);

	const theme = useMantineTheme();

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

	const hasSimpleTasks = (date: Date, dates: DateAggregation[]): boolean => {
		for (let i = 0; i < dates.length; i++) {
			if (dates[i].workDate.getTime() === date.getTime()) {
				return dates[i].simpleTasksCount > 0;
			}
		}
		return false;
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
		const hasSimple = hasSimpleTasks(date, agg);
		if (count) {
			style = {
				...style,
				backgroundColor: theme.fn.rgba(getHeatmapColor(count / maxCount), 0.4),
			};
		} else if (hasSimple) {
			style = {
				...style,
				backgroundColor:
					theme.colorScheme == "light"
						? theme.fn.rgba(theme.colors.gray[5], 0.2)
						: theme.fn.rgba(theme.colors.gray[9], 1),
				color:
					theme.colorScheme == "light"
						? theme.colors.gray[9]
						: theme.colors.gray[1],
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
			<Tooltip label={hours + " min."} disabled={!hours} openDelay={500}>
				<Box
					sx={{
						position: "relative",
						width: "100%",
						textDecoration: isToday ? "underline" : "none",
					}}
				>
					<Text>{date.getDate()}</Text>
				</Box>
			</Tooltip>
		);
	};

	const label = (
		<Tooltip label="Shows which days are busiest. More Red = More Busy">
			<div>{props.label || "Work Date"}</div>
		</Tooltip>
	);

	return (
		<DatePicker
			label={label}
			renderDay={getRenderDate}
			dayStyle={getDateStyle}
			{...props}
		></DatePicker>
	);
}
