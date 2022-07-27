import { Box, Center, Container, useMantineTheme } from "@mantine/core";
import { Calendar, DayModifiers } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { useContext, useEffect, useState } from "react";
import { DateAggregation } from "types";
import { getDateAggregation } from "../../clientapi/dates";
import { SettingsContext } from "../../contexts/SettingsContext";
import { getDates } from "../../serverapi/dates";
import { getHeatmapColor, getUserFromJWT } from "../../utils";

interface CalendarPageProps {
  aggregation: DateAggregation[];
}

export default function CalendarPage({
  aggregation: initialAggregation,
}: CalendarPageProps) {
  const { data: agg } = useQuery<DateAggregation[], Error>(
    ["dates"],
    getDateAggregation,
    {
      initialData: initialAggregation,
    }
  );

  const theme = useMantineTheme();
  const { settings } = useContext(SettingsContext);

  const [maxCount, setMaxCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Update the maximum for gradient calculation
  useEffect(() => {
    console.log(agg);
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
    <>
      <Container
        sx={(theme) => ({
          maxWidth: theme.breakpoints.sm,
        })}
      >
        <Calendar
          hideOutsideDates
          dayStyle={getDateStyle}
          value={selectedDate}
          firstDayOfWeek={settings.firstDayOfWeek}
          onChange={setSelectedDate}
          fullWidth
          allowLevelChange={false}
        />
        {selectedDate ? selectedDate.toLocaleDateString() : null}
      </Container>
    </>
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
