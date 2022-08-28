import { Box, Group, Title, Text, Pagination, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { usePagination } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import TaskContainer from "../../components/containers/TaskContainer";
import SortBySelector, {
	SortByValueOptions,
} from "../../components/details/SortBySelector";
import ClassIdPicker from "../../components/input/ClassIdPicker";
import CenterInfo from "../../components/small/CenterInfo";
import useSkeletonCount from "../../hooks/useSkeletonCount";
import { InferQueryOutput, trpc, vanilla } from "../../utils/trpc";

export default function TaskDetailsPage() {
	const [sortBy, setSortBy] = useState<SortByValueOptions>("dueDate");

	// TODO: use a multi-select for classIds
	const form = useForm({
		initialValues: {
			classId: null,
		},
	});
	const perPage = 10;
	const { data: pageCount } = trpc.useQuery(
		[
			"tasks.pagecount",
			{
				classId: form.values.classId,
				perPage,
			},
		],
		{ ssr: false }
	);
	const pagination = usePagination({
		total: pageCount || 0,
		initialPage: 1,
	});

	const { data, status, error } = useQuery<
		InferQueryOutput<"tasks.details">,
		Error
	>(
		[
			"tasks",
			{ sortBy, classId: form.values.classId, page: pagination.active },
		],
		() => {
			return vanilla.query("tasks.details", {
				sortBy: sortBy,
				classId: form.values.classId,
				perPage,
				page: pagination.active,
			});
		}
	);

	const [oldTasks, setOldTasks] =
		useState<InferQueryOutput<"tasks.details"> | null>(null);

	const skeletonCount = useSkeletonCount("details", data);

	useEffect(() => {
		if (!data) return;
		setOldTasks(data);
	}, [data]);

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
				mb="xl"
			>
				<Title mb="md" order={2}>
					Details
				</Title>
				<Group>
					<ClassIdPicker placeholder="All Classes" form={form} />
					<SortBySelector value={sortBy} setValue={setSortBy} />
				</Group>
			</Box>
			{error && (
				<CenterInfo
					color="red"
					text={error?.message || "There was an error getting tasks"}
				/>
			)}
			<TaskContainer
				oldTasks={oldTasks}
				skeletonLength={skeletonCount}
				loading={status === "loading"}
				as="detailed"
				menu={{
					delete: true,
					edit: true,
				}}
				checkbox={true}
				tasks={data}
			/>
			{pageCount && pageCount > 1 && (
				<Center mt="lg">
					<Pagination
						onChange={(page) => pagination.setPage(page)}
						page={pagination.active}
						total={pageCount || 0}
					/>
				</Center>
			)}
		</>
	);
}
