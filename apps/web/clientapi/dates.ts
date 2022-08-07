import { APIDateAggregationResponse, DateAggregation } from "types";

export async function getDateAggregation(): Promise<DateAggregation[]> {
	try {
		const data = await fetch("/api/dates");
		const json: APIDateAggregationResponse = await data.json();
		if (json.error || !json.dates) {
			console.error(json.error);
			throw new Error(json?.error?.message || "Unknown error getting dates");
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
