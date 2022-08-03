import {
	ActionIcon,
	Anchor,
	AppShell,
	Burger,
	Group,
	Header,
	MantineTheme,
	MediaQuery,
	Navbar,
	Space,
	Text,
	ThemeIcon,
	UnstyledButton,
	useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openSpotlight } from "@mantine/spotlight";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { ReactElement, useContext, useState } from "react";
import {
	Calendar,
	Clock,
	Command,
	List,
	School,
	Settings,
} from "tabler-icons-react";
import { SettingsContext } from "../../contexts/SettingsContext";
import FocusModeDisplay from "../affixes/FocusModeDisplay";
import { ColorSchemeToggle } from "../ColorSchemeToggle";

import Logo from "../small/Logo";

interface LayoutShellProps {
	children: React.ReactNode;
}

interface SidebarLink {
	href: string;
	label: string;
	icon: ReactElement;
}

interface SidebarGroupProps {
	links: SidebarLink[];
}

export default function LayoutShell({ children }: LayoutShellProps) {
	const router: NextRouter = useRouter();
	const [opened, setOpened] = useState(false);
	const isMobile = useMediaQuery("(max-width: 900px)", false);

	const { settings } = useContext(SettingsContext);
	const theme = useMantineTheme();

	const tasksGroup: SidebarLink[] = [
		{ href: "/tasks/today", label: "Today", icon: <Clock /> },
		{ href: "/tasks/", label: "All Tasks", icon: <List /> },
		{ href: "/calendar/", label: "Calendar", icon: <Calendar /> },
	];
	const classesGroup: SidebarLink[] = [
		{ href: "/classes/", label: "Classes", icon: <School /> },
	];

	const showUserLinks =
		router.pathname === "/" ||
		router.pathname === "/login" ||
		router.pathname === "/signup";

	function SidebarGroup({ links }: SidebarGroupProps) {
		const elements = links.map((link) => (
			<Link href={link.href} key={link.href}>
				<UnstyledButton
					onClick={() => setOpened(false)}
					sx={(theme) => ({
						display: "block",
						width: "100%",
						padding: theme.spacing.xs,
						borderRadius: theme.radius.sm,
						color:
							theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
						"&:hover": {
							backgroundColor:
								theme.colorScheme === "dark"
									? theme.colors.dark[6]
									: theme.colors.gray[0],
						},
					})}
				>
					<Group>
						{link.icon}
						<Text size="sm">{link.label}</Text>
					</Group>
				</UnstyledButton>
			</Link>
		));

		return <Navbar.Section>{elements}</Navbar.Section>;
	}

	const headerContent = (
		<Group
			sx={(theme) => ({
				paddingInline: theme.spacing.lg,
				height: "100%",
			})}
			position="apart"
		>
			<MediaQuery largerThan="sm" styles={{ display: "none" }}>
				<Burger
					opened={opened}
					onClick={() => setOpened((o) => !o)}
					size="sm"
					color={theme.colors.gray[6]}
				/>
			</MediaQuery>
			<Logo></Logo>
			<Group spacing={22}>
				{showUserLinks ? (
					<>
						<Link href="/login">
							<Anchor>Login</Anchor>
						</Link>
						<Link href="/signup">
							<Anchor>Sign Up</Anchor>
						</Link>
					</>
				) : (
					<>
						<ActionIcon onClick={() => openSpotlight()}>
							<ThemeIcon variant="filled">
								<Command width={20} height={20} />
							</ThemeIcon>
						</ActionIcon>
						<UnstyledButton onClick={() => router.replace("/settings")}>
							<ThemeIcon variant="light">
								<Settings width={20} height={20} />
							</ThemeIcon>
						</UnstyledButton>
					</>
				)}

				<ColorSchemeToggle />
			</Group>
		</Group>
	);

	const navbarContent = (
		// 0 z index so confetti can be seen infront of the navbar
		<Navbar
			hiddenBreakpoint="xs"
			hidden={!opened}
			style={{ zIndex: isMobile ? 100 : 0 }}
			width={{ lg: 230, xs: 300 }}
			p="xs"
		>
			<SidebarGroup links={tasksGroup} />
			<Space h="md" />
			<SidebarGroup links={classesGroup} />
		</Navbar>
	);

	const hideSidebar =
		router.pathname === "/" ||
		router.pathname === "/login" ||
		router.pathname === "/signup";

	return (
		<AppShell
			padding="md"
			navbar={hideSidebar ? undefined : navbarContent}
			navbarOffsetBreakpoint="xs"
			header={<Header height={60}>{headerContent}</Header>}
			styles={(theme: MantineTheme) => ({
				main: {
					backgroundColor:
						theme.colorScheme === "dark"
							? theme.colors.dark[8]
							: theme.colors.gray[0],
					minHeight: "100vh",
				},
			})}
		>
			{settings.useFocusMode && <FocusModeDisplay />}
			{children}
		</AppShell>
	);
}
