import { DateAggregation } from "types";

export async function getDateAggregation(): Promise<DateAggregation[]> {
  try {
    const data = await fetch("/api/dates");
    const json = await data.json();
    if (json.error) {
      console.error(json.error);
      throw new Error(json.error.message);
    }
    // Fix dates
    return json.dates.map((agg: DateAggregation) => {
      return {
        ...agg,
        workDate: new Date(agg.workDate),
      };
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
