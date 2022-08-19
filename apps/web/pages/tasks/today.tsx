import { Box, Divider, Group, Space, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { TaskWithClass } from "types";
import DailyTaskContainer from "../../components/containers/DailyTaskContainer";
import TaskContainer from "../../components/containers/TaskContainer";
import CenterInfo from "../../components/small/CenterInfo";
import NewTaskButton from "../../components/small/NewTaskButton";
import TodayTimeSum from "../../components/small/TodayTimeSum";
import { SettingsContext } from "../../contexts/SettingsContext";
import useInitialPrefetch from "../../hooks/useInitialPrefetch";
import { getWeekdayNumber } from "../../utils/client";
import { trpc, vanilla } from "../../utils/trpc";

interface TodayTasksPageProps {}

export default function TodayTasksPage({}: TodayTasksPageProps) {
	const {
		status,
		data: tasks,
		error,
	} = useQuery<TaskWithClass[], Error>(["tasks", { type: "today" }], () =>
		vanilla.query("tasks.today")
	);

	const {
		status: dailyStatus,
		data: dailyTasks,
		error: dailyError,
	} = trpc.useQuery(["daily.on-dates", [getWeekdayNumber()]]);

	const { settings } = useContext(SettingsContext);

	useInitialPrefetch();

	const isMobile = useMediaQuery("(max-width: 900px)", false);

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Box
					sx={(theme) => ({
						display: isMobile ? "block" : "flex",
						alignItems: "baseline",
						gap: theme.spacing.md,
					})}
					mb="md"
				>
					<Title order={2}>Today</Title>
					{!isMobile && <TodayTimeSum tasks={tasks} />}
				</Box>
				<NewTaskButton />
			</Box>
			{error && <CenterInfo color="red" text={error.message} />}
			{status != "loading" && tasks && tasks.length == 0 && (
				<CenterInfo mb="md" text="No tasks today!" />
			)}
			<TaskContainer
				loading={status == "loading"}
				skeletonLength={3}
				checkbox
				menu={{ delete: true, edit: true }}
				tasks={tasks}
			/>
			{settings.useDailyTasks && (
				<>
					<Divider my="lg" />
					<Title mb="md" order={4}>
						Daily Tasks
					</Title>
					{error && (
						<CenterInfo
							color="red"
							text={dailyError?.message || "Error getting daily tasks"}
						/>
					)}
					<DailyTaskContainer
						skeletonLength={1}
						grid
						loading={dailyStatus === "loading"}
						tasks={dailyTasks}
						checkbox
					/>
				</>
			)}
		</>
	);
}
