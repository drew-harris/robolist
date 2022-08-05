import { Center, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { TaskWithClass } from "types";
import { getTodayTasks } from "../../clientapi/tasks";
import TaskContainer from "../../components/containers/TaskContainer";
import CenterInfo from "../../components/small/CenterInfo";
import { getTodayTasksFromId } from "../../serverapi/tasks";
import { getUserFromJWT } from "../../utils/user";

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
			{error && <CenterInfo color="red" text={error.message} />}
			{status != "loading" && tasks.length == 0 && (
				<CenterInfo text="No tasks today" />
			)}
			<TaskContainer
				loading={status == "loading"}
				skeletonLength={3}
				checkbox
				menu={{ delete: true, edit: true }}
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
