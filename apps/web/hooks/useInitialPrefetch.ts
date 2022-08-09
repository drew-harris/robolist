import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getClasses } from "../clientapi/classes";
import { getDateAggregation } from "../clientapi/dates";
import { getTasks, getTodayTasks } from "../clientapi/tasks";
import { trpc } from "../utils/trpc";

export default function useInitialPrefetch() {
	const queryClient = useQueryClient();
	const trpcQueryClient = trpc.useContext();
	useEffect(() => {
		queryClient.prefetchQuery(["tasks", { type: "today" }], getTodayTasks);
		queryClient.prefetchQuery(["classes"], getClasses);
		queryClient.prefetchQuery(["dates"], getDateAggregation);

	}, [queryClient]);
}
