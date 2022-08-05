import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { APICompleteRequest, RescheduleInput, TaskWithClass } from "types";
import { getDateAggregation } from "../clientapi/dates";
import {
	deleteTask,
	markTaskStatus,
	rescheduleTask,
	updateTask,
} from "../clientapi/tasks";
import { FocusContext } from "../contexts/FocusContext";
import { getHumanDateString } from "../utils/utils";

export default function useTaskMutation() {
	const queryClient = useQueryClient();
	const focus = useContext(FocusContext);

	const deleteMutation = useMutation(
		(task: TaskWithClass) => {
			return deleteTask(task.id);
		},
		{
			onMutate: async (task: TaskWithClass) => {
				await queryClient.cancelQueries(["tasks"]);
				await queryClient.setQueriesData(
					["tasks"],
					(oldData: TaskWithClass[] | undefined) => {
						return oldData?.filter((t) => t.id !== task.id);
					}
				);
			},

			onSuccess: async (data, task, context) => {
				if (focus.focusState.task && focus.focusState.task.id === task.id) {
					focus.fn.cancel();
				}
				await queryClient.invalidateQueries(["tasks"]);
			},

			onError: async (task: TaskWithClass) => {
				await queryClient.setQueriesData(
					["tasks"],
					(oldData: TaskWithClass[] | undefined) => {
						if (!oldData) {
							return;
						}
						return [...oldData, task];
					}
				);
				await queryClient.invalidateQueries(["tasks"]);
				showNotification({
					message: "Error deleting task",
					color: "red",
				});
			},
		}
	);

	const rescheduleMutation = useMutation(
		(input: RescheduleInput) => {
			return rescheduleTask(input.task, input.date);
		},
		{
			onError: async () => {
				showNotification({
					message: "Error rescheduling task",
					color: "red",
				});
			},
			onSuccess: async (data, task, context) => {
				showNotification({
					message: "Task rescheduled for " + getHumanDateString(data.workDate),
					color: "green",
				});
				if (focus.focusState.task && focus.focusState.task.id === data.id) {
					focus.fn.cancel();
				}
			},
			onSettled: async () => {
				await queryClient.invalidateQueries(["tasks"]);
				await queryClient.invalidateQueries(["dates"]);
				await queryClient.prefetchQuery(["dates"], () => {
					return getDateAggregation();
				});
			},
		}
	);

	const checkMutation = useMutation(
		(state: APICompleteRequest) => {
			if (state.minutes) {
				return markTaskStatus(state.id, state.complete, state.minutes);
			} else {
				return markTaskStatus(state.id, state.complete);
			}
		},
		{
			onMutate: async (state) => {
				await queryClient.cancelQueries(["tasks"]);

				await queryClient.setQueriesData(
					["tasks"],
					(oldData: TaskWithClass[] | undefined) => {
						if (!oldData) {
							return [];
						}

						return oldData.map((t) => {
							if (t.id === state.id) {
								return { ...t, complete: state.complete };
							}
							return t;
						});
					}
				);
			},

			onSuccess: async () => {
				await queryClient.invalidateQueries(["tasks"]);
			},

			onError: async (err, state) => {
				await queryClient.invalidateQueries(["tasks"]);
				await queryClient.setQueriesData(
					["tasks"],
					(oldData: TaskWithClass[] | undefined) => {
						if (!oldData) {
							return [];
						}

						return oldData.map((t) => {
							if (t.id === state.id) {
								return { ...t, complete: !state.complete };
							}
							return t;
						});
					}
				);
				showNotification({
					message: "Error marking task as complete",
					color: "red",
				});
			},
		}
	);

	const editMutation = useMutation(
		(task: Partial<TaskWithClass>) => {
			return updateTask(task);
		},
		{
			onMutate: async (partial) => {
				await queryClient.cancelQueries(["tasks"]);
				await queryClient.cancelQueries(["dates"]);
				await queryClient.setQueriesData(
					["tasks"],
					(oldData: TaskWithClass[] | undefined) => {
						if (!oldData) {
							return [];
						}

						return oldData.map((t) => {
							if (t.id === partial.id) {
								return {
									...t,
									...partial,
								};
							}
							return t;
						});
					}
				);
			},

			onSuccess: async (data, task, context) => {
				await queryClient.setQueriesData(
					["tasks"],
					(oldData: TaskWithClass[] | undefined) => {
						if (!oldData) {
							return [];
						}

						return oldData.map((t) => {
							if (t.id === data.id) {
								return {
									...t,
									...data,
								};
							}
							return t;
						});
					}
				);
				if (focus.focusState.task && focus.focusState.task.id === task.id) {
					focus.setFocusState({
						...focus.focusState,
						task: data,
					});
				}
			},

			onError: async (err: Error, task, context) => {
				showNotification({
					message: err.message,
					color: "red",
				});
			},

			onSettled: async () => {
				await queryClient.invalidateQueries(["tasks"]);
				await queryClient.invalidateQueries(["dates"]);
				await queryClient.prefetchQuery(["dates"], () => {
					return getDateAggregation();
				});
			},
		}
	);

	return { deleteMutation, rescheduleMutation, checkMutation, editMutation };
}
