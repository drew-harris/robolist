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
	NavLink,
	Space,
	ThemeIcon,
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
	Hourglass,
	List,
	School,
	Settings,
} from "tabler-icons-react";
import { FocusContext } from "../../contexts/FocusContext";
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
	const { focusState } = useContext(FocusContext);

	const { settings } = useContext(SettingsContext);
	const theme = useMantineTheme();

	const tasksGroup: SidebarLink[] = [
		{ href: "/tasks/today", label: "Today", icon: <Clock /> },
		{ href: "/tasks", label: "All Tasks", icon: <List /> },
		{ href: "/calendar", label: "Calendar", icon: <Calendar /> },
		{ href: "/focus", label: "Focus", icon: <Hourglass /> },
	];
	const classesGroup: SidebarLink[] = [
		{ href: "/classes", label: "Classes", icon: <School /> },
		{ href: "/settings", label: "Settings", icon: <Settings /> },
	];
	const otherGroup: SidebarLink[] = [];

	const showUserLinks =
		router.pathname === "/" ||
		router.pathname === "/login" ||
		router.pathname === "/signup" ||
		router.pathname === "/closed";

	function SidebarGroup({ links }: SidebarGroupProps) {
		const elements = links.map((link) => {
			return (
				<Link href={link.href} id={link.href}>
					<NavLink
						onClick={() => {
							setOpened(false);
						}}
						sx={(theme) => ({
							borderRadius: theme.radius.sm,
						})}
						icon={link.icon}
						active={router.pathname === link.href}
						label={link.label}
					/>
				</Link>
			);
		});
		return <Navbar.Section p={theme.spacing.sm}>{elements}</Navbar.Section>;
	}

	const headerContent = (
		<Group
			sx={(theme) => ({
				paddingInline: theme.spacing.lg,
				height: "100%",
			})}
			position="apart"
		>
			{!showUserLinks ? (
				<MediaQuery largerThan="sm" styles={{ display: "none" }}>
					<Burger
						opened={opened}
						onClick={() => setOpened((o) => !o)}
						size="sm"
						color={theme.colors.gray[6]}
					/>
				</MediaQuery>
			) : null}
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
			width={{ lg: 250, xs: 200 }}
		>
			<SidebarGroup links={tasksGroup} />
			<SidebarGroup links={classesGroup} />
			<SidebarGroup links={otherGroup} />
		</Navbar>
	);

	return (
		<AppShell
			padding={router.pathname === "/" ? 0 : "md"}
			navbar={showUserLinks ? undefined : navbarContent}
			navbarOffsetBreakpoint="xs"
			header={<Header height={60}>{headerContent}</Header>}
			styles={(theme: MantineTheme) => ({
				main: {
					backgroundColor:
						theme.colorScheme === "dark"
							? theme.colors.dark[8]
							: theme.colors.gray[0],
				},
			})}
		>
			{settings.useFocusMode && !router.pathname.includes("/focus") && (
				<FocusModeDisplay />
			)}
			{children}
			{focusState.task && !router.pathname.includes("focus") && (
				<Space w="xl" h={110} />
			)}
		</AppShell>
	);
}
