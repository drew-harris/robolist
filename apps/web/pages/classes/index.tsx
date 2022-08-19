import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Center, Loader, SimpleGrid, Stack, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Class } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import ClassSquare from "../../components/data-display/ClassSquare";
import CenterInfo from "../../components/small/CenterInfo";
import NewClassButton from "../../components/small/NewClassButton";
import useInitialPrefetch from "../../hooks/useInitialPrefetch";
import { vanilla } from "../../utils/trpc";

const ClassesPage = () => {
	const [parent] = useAutoAnimate<HTMLDivElement>();
	const isMobile = useMediaQuery("(max-width: 900px)", false);
	const {
		data: classes,
		error,
		status,
	} = useQuery<Class[], Error>(["classes"], () => vanilla.query("classes.all"));

	useInitialPrefetch();

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
			{status === "loading" && (
				<Center>
					<Loader />
				</Center>
			)}
			{classes && classes.length == 0 && <CenterInfo text="No classes yet" />}
			<SimpleGrid ref={parent} cols={isMobile ? 1 : 3}>
				{classElements}
			</SimpleGrid>
		</>
	);
};

export default ClassesPage;
