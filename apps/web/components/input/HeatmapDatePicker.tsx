import { Tooltip, useMantineTheme } from "@mantine/core";
import { DatePicker, DayModifiers } from "@mantine/dates";
import { useEffect, useState } from "react";
import { DateAggregation } from "types";
import { getDateAggregation } from "../../clientapi/dates";
import { getHeatmapColor } from "../../utils";

const label = (
  <Tooltip label="Shows which days are busiest. More Red = More Busy">
    <div>Work Date</div>
  </Tooltip>
);

export default function HeatmapDatePicker(props: any) {
  const [dateAgg, setDateAgg] = useState<DateAggregation[] | null>(null);
  const [maxCount, setMaxCount] = useState(0);
  const theme = useMantineTheme();

  const fetchDates = async () => {
    try {
      const dates = await getDateAggregation();
      console.log(dates);
      setDateAgg(dates);
      let max = 0;
      for (const date of dates) {
        console.log(`Curr: ${date._sum.workTime} Max: ${max}`);
        if (date._sum.workTime) {
          if (date._sum.workTime > max) {
            max = date._sum.workTime || 0;
          }
        }
      }
      setMaxCount(max);
    } catch (error: any) {
      console.error(error.message);
      setDateAgg(null);
    }
  };

  useEffect(() => {
    fetchDates();
  }, []);

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
    if (!dateAgg) {
      return null;
    }
    if (modifiers.disabled) {
      return null;
    }
    const count = getCountOfDate(date, dateAgg);
    if (count) {
      return {
        backgroundColor: theme.fn.rgba(getHeatmapColor(count / maxCount), 0.2),
      };
    }

    return null;
  };

  return (
    <DatePicker label={label} dayStyle={getDateStyle} {...props}></DatePicker>
  );
}
