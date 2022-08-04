import { Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { useEffect } from "react";
import { TaskWithClass } from "types";
import { getTasks } from "../../clientapi/tasks";
import TaskAgendaContainer from "../../components/containers/TaskAgendaContainer";
import TaskContainer from "../../components/containers/TaskContainer";
import CenterInfo from "../../components/small/CenterInfo";
import { getTasksFromUserId } from "../../serverapi/tasks";
import { getUserFromJWT, reduceDates } from "../../utils";

interface TasksPageProps {
	tasks: TaskWithClass[];
}

export default function TasksPage({ tasks: initialTasks }: TasksPageProps) {
	const {
		data: tasks,
		error,
		status,
	} = useQuery<TaskWithClass[], Error>(["tasks", { type: "all" }], getTasks, {
		initialData: initialTasks,
	});

	return (
		<>
			<Title mb="md" order={2}>
				All Tasks
			</Title>
			{error && <CenterInfo color="red" text={error.message} />}
			{status != "loading" && tasks.length == 0 && (
				<CenterInfo text="No tasks yet" />
			)}
			<TaskAgendaContainer
				menu={{ delete: true, edit: true }}
				rescheduleButton
				loading={status === "loading"}
				tasks={tasks}
			/>
		</>
	);
}

export async function getServerSideProps(
	context: NextPageContext
): Promise<GetServerSidePropsResult<TasksPageProps>> {
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

	const tasks = await getTasksFromUserId(user.id);
	return {
		props: {
			tasks,
		},
	};
}
