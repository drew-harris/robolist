import { showNotification } from "@mantine/notifications";
import { DailyWithClass } from "types";
import { getWeekdayNumber } from "../utils/client";
import { trpc } from "../utils/trpc";

export default function useDailyMutation() {
	const trpcQueryClient = trpc.useContext();

	const createDaily = trpc.useMutation("daily.create", {
		onMutate: () => {
			trpcQueryClient.cancelQuery(["daily.all"]);
			trpcQueryClient.cancelQuery(["daily.on-dates", [getWeekdayNumber()]]);
		},
		onSettled: (res) => {
			trpcQueryClient.invalidateQueries("daily.all");
			trpcQueryClient.invalidateQueries("daily.on-dates");
		},
	});

	const completeDaily = trpc.useMutation("daily.complete", {
		onMutate: async (res) => {
			trpcQueryClient.cancelQuery(["daily.all"]);
			trpcQueryClient.cancelQuery(["daily.on-dates", [getWeekdayNumber()]]);
			const updater = (old: any) => {
				if (!old) {
					return [];
				}
				return old.map((daily: DailyWithClass) => {
					if (daily.id === res) {
						return {
							...daily,
							lastCompleted: new Date(),
						};
					}
					return daily;
				});
			};
			trpcQueryClient.setQueryData(["daily.all"], updater);
			trpcQueryClient.setQueryData(
				["daily.on-dates", [getWeekdayNumber()]],
				updater
			);
		},
		onSettled: (res) => {
			trpcQueryClient.invalidateQueries("daily.all");
			trpcQueryClient.invalidateQueries("daily.on-dates");
		},
	});

	const uncheckDaily = trpc.useMutation("daily.uncomplete", {
		onMutate: async (res) => {
			trpcQueryClient.cancelQuery(["daily.all"]);
			trpcQueryClient.cancelQuery(["daily.on-dates", [getWeekdayNumber()]]);
			const updater = (old: any) => {
				if (!old) {
					return [];
				}
				return old.map((daily: DailyWithClass) => {
					if (daily.id === res) {
						return {
							...daily,
							lastCompleted: new Date(Date.now() - 1000 * 60 * 60 * 24),
						};
					}
					return daily;
				});
			};
			trpcQueryClient.setQueryData(["daily.all"], updater);
			trpcQueryClient.setQueryData(
				["daily.on-dates", [getWeekdayNumber()]],
				updater
			);
		},
		onSettled: (res) => {
			trpcQueryClient.invalidateQueries("daily.all");
			trpcQueryClient.invalidateQueries("daily.on-dates");
		},
	});

	const deleteDaily = trpc.useMutation("daily.delete", {
		onMutate: async (res) => {
			trpcQueryClient.setQueryData(["daily.all"], (old: any) => {
				if (!old) {
					return [];
				}
				return old.filter((daily: DailyWithClass) => daily.id !== res);
			});
		},

		onSettled: (res) => {
			trpcQueryClient.invalidateQueries("daily.all");
			trpcQueryClient.invalidateQueries("daily.on-dates");
		},
	});

	const editDaily = trpc.useMutation("daily.edit", {
		onMutate: async (res) => {
			trpcQueryClient.cancelQuery(["daily.all"]);
			trpcQueryClient.cancelQuery(["daily.on-dates", [getWeekdayNumber()]]);

			const updater = (old: any) => {
				if (!old) {
					return [];
				}
				return old.map((daily: DailyWithClass) => {
					if (daily.id === res.id) {
						return {
							...daily,
							...res,
						};
					}
					return daily;
				});
			};

			trpcQueryClient.setQueryData(["daily.all"], updater);
			trpcQueryClient.setQueryData(
				["daily.on-dates", [getWeekdayNumber()]],
				updater
			);
		},

		onError: (err) => {
			showNotification({
				message: err.message || "Error editing daily",
				color: "red",
			});
		},

		onSettled: (res) => {
			trpcQueryClient.invalidateQueries("daily.all");
			trpcQueryClient.invalidateQueries("daily.on-dates");
		},
	});

	return { createDaily, completeDaily, uncheckDaily, deleteDaily, editDaily };
}
