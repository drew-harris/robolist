import { Box, Container, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { TaskWithClass } from "types";
import { getTodayTasks } from "../../clientapi/tasks";
import TaskContainer from "../../components/containers/TaskContainer";
import { getTodayTasksFromId } from "../../serverapi/tasks";
import { getUserFromJWT } from "../../utils";

interface TodayTasksPageProps {
	tasks: TaskWithClass[];
}

export default function TodayTasksPage({
	tasks: initialTasks,
}: TodayTasksPageProps) {
	const {
		status,
		data: tasks,
		error,
	} = useQuery<TaskWithClass[], Error>(
		["tasks", { type: "today" }],
		getTodayTasks,
		{
			initialData: initialTasks,
		}
	);

	return (
		<>
			<Title order={2} mb="md">
				Today
			</Title>
			{error?.message}
			<TaskContainer
				loading={status == "loading"}
				skeletonLength={3}
				checkbox
				rescheduleButton
				menu={{ delete: true }}
				tasks={tasks}
			/>
		</>
	);
}

export async function getServerSideProps(
	context: NextPageContext
): Promise<GetServerSidePropsResult<TodayTasksPageProps>> {
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

	const tasks = await getTodayTasksFromId(user.id);
	return {
		props: { tasks }, // will be passed to the page component as props
	};
}
