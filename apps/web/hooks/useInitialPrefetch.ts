import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getDateAggregation } from "../clientapi/dates";
import { getWeekdayNumber } from "../utils/client";
import { trpc, vanilla } from "../utils/trpc";

export default function useInitialPrefetch() {
	const queryClient = useQueryClient();
	const trpcQueryClient = trpc.useContext();
	useEffect(() => {
		queryClient.prefetchQuery(["tasks", { type: "today" }], () =>
			vanilla.query("tasks.today")
		);
		queryClient.prefetchQuery(["tasks", { type: "all" }], () =>
			vanilla.query("tasks.all")
		);
		queryClient.prefetchQuery(["classes"], () => vanilla.query("classes.all"));
		queryClient.prefetchQuery(["dates"], getDateAggregation);

		queryClient.prefetchQuery(
			["tasks", { sortBy: "dueDate", classId: null, page: 1 }],
			() => {
				return vanilla.query("tasks.details", {
					sortBy: "dueDate",
					classId: null,
					perPage: 10,
					page: 1,
				});
			}
		);

		trpcQueryClient.prefetchQuery(["daily.all"]);
		trpcQueryClient.prefetchQuery(["daily.on-dates", [getWeekdayNumber()]]);
	}, [queryClient]);
}
