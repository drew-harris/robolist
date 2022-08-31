import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, SimpleGrid, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import ClassSquare from "../../components/data-display/ClassSquare";
import ClassSkeleton from "../../components/skeletons/ClassSkeleton";
import CenterInfo from "../../components/small/CenterInfo";
import NewClassButton from "../../components/small/NewClassButton";
import useInitialPrefetch from "../../hooks/useInitialPrefetch";
import useSkeletonCount from "../../hooks/useSkeletonCount";
import { InferQueryOutput, vanilla } from "../../utils/trpc";

interface ClassesContainerProps {
	classes: InferQueryOutput<"classes.all"> | undefined;
	loading: boolean;
	skeletonLength?: number;
}

const ClassesContainer = ({
	classes,
	loading,
	skeletonLength = 4,
}: ClassesContainerProps) => {
	const [parent] = useAutoAnimate<HTMLDivElement>();
	const isMobile = useMediaQuery("(max-width: 900px)", false);
	if (loading) {
		return (
			<>
				<SimpleGrid cols={isMobile ? 1 : 3}>
					{[...Array(skeletonLength)].map((e, i) => (
						<ClassSkeleton key={i} />
					))}
				</SimpleGrid>
			</>
		);
	}
	return (
		<>
			<SimpleGrid ref={parent} cols={isMobile ? 1 : 3}>
				{classes?.map((class_) => (
					<ClassSquare key={class_.id} class={class_} />
				))}
			</SimpleGrid>
		</>
	);
};

const ClassesPage = () => {
	const {
		data: classes,
		error,
		status,
	} = useQuery<InferQueryOutput<"classes.all">, Error>(["classes"], () =>
		vanilla.query("classes.all")
	);

	useInitialPrefetch();

	const skeletonCount = useSkeletonCount("classes", classes);

	const classElements = classes
		? classes.map((class_) => {
				return <ClassSquare key={class_.id} class={class_} />;
		  })
		: null;

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Title order={2} mb="md">
					Classes
				</Title>
				<NewClassButton />
			</Box>

			{error && <CenterInfo color="red" text={error.message} />}
			{classes && classes.length == 0 && <CenterInfo text="No classes yet" />}
			<ClassesContainer
				skeletonLength={skeletonCount}
				classes={classes}
				loading={status === "loading"}
			/>
		</>
	);
};

export default ClassesPage;
