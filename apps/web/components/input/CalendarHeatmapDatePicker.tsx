import { useMantineTheme } from "@mantine/core";
import { Calendar, CalendarProps, DayModifiers } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { DateAggregation } from "types";
import { getDateAggregation } from "../../clientapi/dates";
import { SettingsContext } from "../../contexts/SettingsContext";
import { getHeatmapColor } from "../../utils";

interface CalendarHeatmapDatePickerProps extends CalendarProps {
  initialAggregation?: DateAggregation[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

export default function CalendarHeatmapDatePicker({
  initialAggregation,
  onSelectDate,
  selectedDate,
  ...props
}: CalendarHeatmapDatePickerProps) {
  const { data: agg } = useQuery<DateAggregation[], Error>(
    ["tasks"],
    getDateAggregation,
    {
      initialData: initialAggregation,
    }
  );

  const theme = useMantineTheme();
  const { settings } = useContext(SettingsContext);

  const [maxCount, setMaxCount] = useState(0);

  // Update the maximum for gradient calculation
  useEffect(() => {
    console.log(agg);
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
    console.log(`Max: ${max}`);
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
      backgroundColor: "transparent",
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

  return (
    <Calendar
      dayStyle={getDateStyle}
      value={selectedDate}
      firstDayOfWeek={settings.firstDayOfWeek}
      onChange={(date) => onSelectDate(date)}
      {...props}
    />
  );
}
