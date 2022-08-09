import { Box, Group, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { TaskWithClass } from "types";
import { getTodayTasks } from "../../clientapi/tasks";
import TaskContainer from "../../components/containers/TaskContainer";
import CenterInfo from "../../components/small/CenterInfo";
import NewTaskButton from "../../components/small/NewTaskButton";
import useInitialPrefetch from "../../hooks/useInitialPrefetch";
import { vanilla } from "../../utils/trpc";

interface TodayTasksPageProps { }

export default function TodayTasksPage({ }: TodayTasksPageProps) {
	const {
		status,
		data: tasks,
		error,
	} = useQuery<TaskWithClass[], Error>(
		["tasks", { type: "today" }],
		() => vanilla.query("tasks.today")
	);

	useInitialPrefetch();

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Title order={2} mb="md">
					Today
				</Title>
				<NewTaskButton />
			</Box>
			{error && <CenterInfo color="red" text={error.message} />}
			{status != "loading" && tasks && tasks.length == 0 && (
				<CenterInfo text="No tasks today" />
			)}
			<TaskContainer
				loading={status == "loading"}
				skeletonLength={2}
				checkbox
				menu={{ delete: true, edit: true }}
				tasks={tasks}
			/>
		</>
	);
}

// export async function getServerSideProps(
// 	context: NextPageContext
// ): Promise<GetServerSidePropsResult<TodayTasksPageProps>> {
// 	const jwt = getCookie("jwt", context);
// 	const user = getUserFromJWT(jwt?.toString());
// 	if (!user) {
// 		return {
// 			redirect: {
// 				destination: "/",
// 				permanent: false,
// 			},
// 		};
// 	}

// 	const tasks = await getTodayTasksFromId(user.id);
// 	return {
// 		props: { tasks }, // will be passed to the page component as props
// 	};
// }
