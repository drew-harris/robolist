import { Box, Popover, Text, Tooltip, useMantineTheme } from "@mantine/core";
import { DatePicker, DayModifiers, isSameDate } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useContext, useEffect, useState } from "react";
import { DateAggregation } from "types";
import { getDateAggregation } from "../../clientapi/dates";
import { SettingsContext } from "../../contexts/SettingsContext";
import { dateIsToday, getHeatmapColor } from "../../utils/utils";

const label = (
	<Tooltip label="Shows which days are busiest. More Red = More Busy">
		<div>Work Date</div>
	</Tooltip>
);

const thisMorning = new Date();
thisMorning.setHours(0, 0, 0, 0);

const aggs: DateAggregation[] = [
	{
		_count: 2,
		_sum: {
			workTime: 30,
		},
		workDate: thisMorning,
	},
	{
		_count: 2,
		_sum: {
			workTime: 40,
		},
		workDate: new Date(thisMorning.getTime() + 1000 * 60 * 60 * 24),
	},
	{
		_count: 2,
		_sum: {
			workTime: 1,
		},
		workDate: new Date(thisMorning.getTime() + 1000 * 60 * 60 * 24 * 2),
	},
];

const generateInitalValue = (): DateAggregation[] => {
	const agg = [];
	for (let i = 0; i < 40; i++) {
		agg.push({
			_count: 0,
			_sum: {
				workTime: Math.floor(Math.random() * 60),
			},
			workDate: new Date(thisMorning.getTime() + 1000 * 60 * 60 * 24 * i),
		});
	}
	return agg;
};

interface HeatmapDatePickerProps {
	ref: React.Ref<any>;
}

export default function DemoHeatmapDatePicker({
	ref,
	...props
}: HeatmapDatePickerProps) {
	const [agg, setAgg] = useState(generateInitalValue());
	const [popoverOpen, setPopoverOpen] = useState(true);

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
			if (isSameDate(dates[i].workDate, date)) {
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
				backgroundColor: theme.fn.rgba(getHeatmapColor(count / maxCount), 0.3),
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

	const getHoursForDay = (date: Date): number | null => {
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
		const hours = getHoursForDay(date);
		const isToday = dateIsToday(date);
		return (
			<Tooltip
				label={hours + " min."}
				disabled={!hours || !settings.useTimeEstimate}
				openDelay={500}
			>
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

	return (
		<Popover
			shadow="lg"
			opened={popoverOpen}
			zIndex={1}
			position="bottom"
			withArrow
		>
			<Popover.Target>
				<DatePicker
					onDropdownOpen={() => setPopoverOpen(false)}
					label={label}
					renderDay={getRenderDate}
					dayStyle={getDateStyle}
					{...props}
				></DatePicker>
			</Popover.Target>
			<Popover.Dropdown>
				<Text color="blue">Click Me!</Text>
			</Popover.Dropdown>
		</Popover>
	);
}
