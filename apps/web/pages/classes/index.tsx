import { useAutoAnimate } from "@formkit/auto-animate/react";
import { SimpleGrid, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Class } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { getClasses } from "../../clientapi/classes";
import ClassSquare from "../../components/data-display/ClassSquare";
import CenterInfo from "../../components/small/CenterInfo";
import { getClassesFromId } from "../../serverapi/classes";
import { getUserFromJWT } from "../../utils";

interface ClassPageProps {
	classes: Class[];
}
const ClassesPage = ({ classes: initialClasses }: ClassPageProps) => {
	const [parent] = useAutoAnimate<HTMLDivElement>();
	const isMobile = useMediaQuery("(max-width: 900px)", false);
	const { data: classes, error } = useQuery<Class[], Error>(
		["classes"],
		getClasses,
		{ initialData: initialClasses }
	);

	const classElements = classes
		? classes.map((class_) => {
				return <ClassSquare key={class_.id} class={class_} />;
		  })
		: null;

	return (
		<>
			<Title order={2} mb="md">
				Classes
			</Title>
			{error && <CenterInfo color="red" text={error.message} />}
			{classes && classes.length == 0 && <CenterInfo text="No classes yet" />}
			<SimpleGrid ref={parent} cols={isMobile ? 1 : 4}>
				{classElements}
			</SimpleGrid>
		</>
	);
};

export default ClassesPage;

export async function getServerSideProps(
	context: NextPageContext
): Promise<GetServerSidePropsResult<ClassPageProps>> {
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

	const classes = await getClassesFromId(user.id);

	return {
		props: {
			classes,
		},
	};
}
