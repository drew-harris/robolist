import { Tooltip, useMantineTheme, Text } from "@mantine/core";
import { DatePicker, DayModifiers } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useContext, useEffect, useState } from "react";
import { DateAggregation } from "types";
import { getDateAggregation } from "../../clientapi/dates";
import { SettingsContext } from "../../contexts/SettingsContext";
import { dateIsToday, getHeatmapColor } from "../../utils";

const label = (
  <Tooltip label="Shows which days are busiest. More Red = More Busy">
    <div>Work Date</div>
  </Tooltip>
);

export default function HeatmapDatePicker(props: any) {
  const { data: agg } = useQuery<DateAggregation[], Error>(
    ["tasks", { type: "dates" }],
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
  ): React.CSSProperties | null => {
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
        sx={(theme) => ({
          position: "relative",
          width: "100%",
          height: "100%",
          textDecoration: isToday ? "underline" : "none",
        })}
        label={hours + " min."}
        disabled={!hours}
        openDelay={500}
      >
        <Text>{date.getDate()}</Text>
      </Tooltip>
    );
  };

  return (
    <DatePicker
      label={label}
      renderDay={getRenderDate}
      styles={{
        cell: {
          overflow: "hidden",
        },
      }}
      dayStyle={getDateStyle}
      {...props}
    ></DatePicker>
  );
}
