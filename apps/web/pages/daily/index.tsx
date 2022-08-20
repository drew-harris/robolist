import { Box, Button, Title } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { Plus } from "tabler-icons-react";
import DailyTaskContainer from "../../components/containers/DailyTaskContainer";
import NewDailyTaskModal from "../../components/modals/NewDailyTaskModal";
import CenterInfo from "../../components/small/CenterInfo";
import useSkeletonCount from "../../hooks/useSkeletonCount";
import { trpc } from "../../utils/trpc";

export default function DailyTasksPage() {
	const { data, error, status } = trpc.useQuery(["daily.all"], {
		ssr: false,
	});
	const open = () => {
		openModal({
			children: <NewDailyTaskModal />,
			title: "New Daily Task",
		});
	};

	const skeletonCount = useSkeletonCount("daily-tasks", data);

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
				mb="sm"
			>
				<Title order={2}>Daily Tasks</Title>
				<Button leftIcon={<Plus />} variant="subtle" onClick={open}>
					New Daily Task
				</Button>
			</Box>
			{error && <CenterInfo text={error.message} color="red" />}
			<DailyTaskContainer
				menu={{ delete: true, edit: true }}
				tasks={data}
				skeletonLength={skeletonCount}
				showBadges
				loading={status === "loading"}
				// loading={true}
			/>
		</>
	);
}
