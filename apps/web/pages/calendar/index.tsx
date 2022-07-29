import { Container } from "@mantine/core";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { useContext, useState } from "react";
import { DateAggregation } from "types";
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
    <>
      <Container
        sx={(theme) => ({
          maxWidth: theme.breakpoints.sm,
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
