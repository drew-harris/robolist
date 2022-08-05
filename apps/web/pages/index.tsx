import {
	Box,
	Button,
	Center,
	Divider,
	List,
	Mark,
	Paper,
	Popover,
	Space,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import Link from "next/link";
import DemoNewTask from "../components/demo/DemoNewTask";
import DemoScheduleController from "../components/demo/DemoSchedule";
import { getUserFromJWT } from "../utils";

export default function Web() {
	const isMobile = useMediaQuery("(max-width: 900px)", false);
	return (
		<>
			{isMobile && <Space h={30} />}
			<Box
				px={isMobile ? "sm" : "xl"}
				mt={isMobile ? 0 : "xl"}
				sx={(theme) => ({
					display: "flex",
					flexDirection: isMobile ? "column" : "row",
					width: "100%",
					justifyContent: "space-evenly",
				})}
			>
				<Box
					px="md"
					sx={(theme) => ({
						flexGrow: 2,
						padding: isMobile ? 0 : theme.spacing.xl,
						maxWidth: isMobile ? undefined : 500,
					})}
				>
					<Stack>
						<Title mb="sm" order={1}>
							Take Control of Your Assignments
						</Title>
						<Title mb="sm" order={4}>
							Organize your schoolwork <Mark></Mark>the way you want - Robolist
							gives you the tools to do it.
						</Title>
						<List spacing="sm" withPadding mb="md">
							<List.Item>Flexible system that works for everyone</List.Item>
							<List.Item>Sort assignments into classes</List.Item>
							<List.Item>Easily see how busy you are</List.Item>
							<List.Item>
								Get estimates for how long assignments will take and race
								against the clock
							</List.Item>
							<List.Item>Coming Soon: Flashcards, Notes, and More</List.Item>
						</List>
						{isMobile && (
							<Center mb="xl">
								<Link href="/signup">
									<Button
										variant="light"
										fullWidth
										sx={{
											justifySelf: "center",
											maxWidth: isMobile ? undefined : "400px",
										}}
									>
										Sign Up
									</Button>
								</Link>
							</Center>
						)}
					</Stack>
				</Box>
				{isMobile && <Divider my="xl"></Divider>}
				<Box
					p={isMobile ? "sm" : "xl"}
					sx={{
						flexGrow: 1,
						maxWidth: "600px",
					}}
				>
					<Paper
						withBorder
						p={isMobile ? "xs" : "lg"}
						mt={isMobile ? undefined : "xl"}
						shadow="md"
					>
						<DemoNewTask />
					</Paper>
				</Box>
			</Box>

			{/* SECTION 2 */}
			{!isMobile && <Divider mb="xl" mt="lg"></Divider>}

			<Box
				px={isMobile ? "sm" : 150}
				sx={(theme) => ({
					display: "flex",
					flexDirection: isMobile ? "column-reverse" : "row",
					justifyContent: isMobile ? "start" : "space-between",
					width: "100%",
					gap: isMobile ? undefined : 100,
				})}
			>
				<Box
					px={isMobile ? "sm" : "xl"}
					mt="xl"
					sx={{
						flexGrow: 1,
						overflow: "hidden",
						minHeight: "80vh",
						maxHeight: "80vh",
					}}
				>
					<DemoScheduleController />
				</Box>
				<Box
					sx={(theme) => ({
						padding: isMobile ? theme.spacing.md : theme.spacing.xl,
						maxWidth: isMobile ? undefined : "50%",
						marginTop: !isMobile ? undefined : theme.spacing.xl,
					})}
				>
					<Title mb="md" mt={isMobile ? "xl" : undefined} order={2}>
						Stop Worrying About Due Dates
					</Title>
					<Text mb="md">
						Robolist focuses on <b>when</b> you need to do your work, not when
						its due.
					</Text>
					<List spacing="sm" mb="sm">
						<List.Item>
							Use time estimates to split work evenly over many days
						</List.Item>
						<List.Item>
							Quickly reschedule assignments when things come up
						</List.Item>
						<List.Item>
							Robolist learns from you and gives better predictions
						</List.Item>
					</List>
				</Box>
			</Box>
		</>
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
