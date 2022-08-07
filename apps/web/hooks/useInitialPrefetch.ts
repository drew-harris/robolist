import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getClasses } from "../clientapi/classes";
import { getDateAggregation } from "../clientapi/dates";
import { getTasks, getTodayTasks } from "../clientapi/tasks";

export default function useInitialPrefetch() {
	const queryClient = useQueryClient();
	useEffect(() => {
		queryClient.prefetchQuery(["tasks", { type: "all" }], getTasks);
		queryClient.prefetchQuery(["tasks", { type: "today" }], getTodayTasks);
		queryClient.prefetchQuery(["classes"], getClasses);
		queryClient.prefetchQuery(["dates"], getDateAggregation);
	}, [queryClient]);
}
