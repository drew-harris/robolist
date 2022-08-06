import { showNotification } from "@mantine/notifications";
import { Class } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClass, editClass } from "../clientapi/classes";

export default function useClassMutation() {
	const queryClient = useQueryClient();
	const deleteMutation = useMutation(
		(id: string) => {
			return deleteClass(id);
		},
		{
			onMutate: async (id: string) => {
				await queryClient.cancelQueries(["classes"]);
				await queryClient.setQueriesData(
					["classes"],
					(oldData: Class[] | undefined) => {
						return oldData?.filter((c) => c.id !== id);
					}
				);
			},
			onError: async (error: Error) => {
				showNotification({
					message: error.message || "Error deleting class",
					color: "red",
				});
			},

			onSettled: async () => {
				await queryClient.invalidateQueries(["classes"]);
			},
		}
	);

	const editMutation = useMutation(
		(classData: Partial<Class>) => {
			return editClass(classData);
		},
		{
			onMutate: async (classData: Partial<Class>) => {
				await queryClient.cancelQueries(["classes"]);
				await queryClient.setQueriesData(
					["classes"],
					(oldData: Class[] | undefined) => {
						if (!oldData) {
							return oldData;
						}
						return oldData.map((c) => {
							if (c.id === classData.id) {
								return { ...c, ...classData };
							}
							return c;
						});
					}
				);
			},
			onError: async (error: Error) => {
				showNotification({
					message: error.message || "Error editing class",
					color: "red",
				});
			},
			onSettled: async () => {
				await queryClient.invalidateQueries(["classes"]);
			},
		}
	);

	return { deleteMutation, editMutation };
}