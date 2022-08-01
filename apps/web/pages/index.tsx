import { Box, Container, Title } from "@mantine/core";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import Link from "next/link";
import { getUserFromJWT } from "../utils";

export default function Web() {
	return (
		<Container mt={89}>
			<Title>Hero Page Here</Title>
		</Container>
	);
}

export async function getServerSideProps(
	context: NextPageContext
): Promise<GetServerSidePropsResult<{}>> {
	const jwt = getCookie("jwt", context);
	const user = getUserFromJWT(jwt?.toString());
	if (user) {
		return {
			redirect: {
				destination: "/tasks/",
				permanent: false,
			},
		};
	}
	return {
		props: {}, // will be passed to the page component as props
	};
}
