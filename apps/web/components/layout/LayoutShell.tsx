import {
	ActionIcon,
	Anchor,
	AppShell,
	Badge,
	Box,
	Burger,
	Group,
	Header,
	Kbd,
	MantineTheme,
	MediaQuery,
	Navbar,
	NavLink,
	ThemeIcon,
	Tooltip,
	useMantineTheme,
} from "@mantine/core";
import { useMediaQuery, useOs } from "@mantine/hooks";
import { openSpotlight } from "@mantine/spotlight";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { ReactElement, useContext, useState } from "react";
import {
	Calendar,
	CalendarTime,
	Clock,
	Columns,
	Command,
	GridPattern,
	Hourglass,
	List,
	School,
	Settings,
} from "tabler-icons-react";
import { SettingsContext } from "../../contexts/SettingsContext";
import useAccountUpdater from "../../hooks/useAccountUpdater";
import FocusModeContentSpacer from "../affixes/FocusModeContentSpacer";
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
	isBeta?: boolean;
}

interface SidebarGroupProps {
	links: SidebarLink[];
}

export default function LayoutShell({ children }: LayoutShellProps) {
	const router: NextRouter = useRouter();
	const [opened, setOpened] = useState(false);
	const isMobile = useMediaQuery("(max-width: 900px)", false);
	const os = useOs();

	const { settings } = useContext(SettingsContext);
	const theme = useMantineTheme();

	useAccountUpdater();

	let tasksGroup: SidebarLink[] = [
		{ href: "/tasks/today", label: "Today", icon: <Clock /> },
		{ href: "/tasks", label: "Agenda", icon: <List /> },
		{ href: "/calendar", label: "Calendar", icon: <Calendar /> },
	];

	if (!isMobile) {
		tasksGroup.push({
			href: "/tasks/details",
			label: "Details",
			icon: <Columns />,
		});
	}

	if (settings.useDailyTasks) {
		tasksGroup.push({ href: "/daily", label: "Daily", icon: <CalendarTime /> });
	}

	if (settings.useFocusMode) {
		tasksGroup.push({ href: "/focus", label: "Focus", icon: <Hourglass /> });
	}

	const classesGroup: SidebarLink[] = [
		{ href: "/classes", label: "Classes", icon: <School /> },
		{ href: "/settings", label: "Settings", icon: <Settings /> },
	];

	const showUserLinks =
		router.pathname === "/" ||
		router.pathname === "/login" ||
		router.pathname === "/signup" ||
		router.pathname === "/closed";

	// Conponent
	function SidebarGroup({ links }: SidebarGroupProps) {
		const elements = links.map((link) => {
			return (
				<Link href={link.href} key={link.href} id={link.href}>
					<NavLink
						rightSection={
							link.isBeta ? (
								<Tooltip
									withinPortal
									label="Preview feature, Looking for feedback"
								>
									<Badge size="sm">BETA</Badge>
								</Tooltip>
							) : null
						}
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

	const commandButtonTooltipLabel =
		os === "macos" ? (
			<Box
				sx={{
					paddingBottom: 5,
				}}
			>
				<Kbd>⌘</Kbd> + <Kbd>K</Kbd>
			</Box>
		) : (
			<Box
				sx={{
					paddingBottom: 5,
				}}
			>
				<Kbd>CTRL</Kbd> + <Kbd>K</Kbd>
			</Box>
		);

	const topBarContent = (
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
							<Anchor>Log In</Anchor>
						</Link>
						<Link href="/signup">
							<Anchor>Sign Up</Anchor>
						</Link>
					</>
				) : (
					<Tooltip openDelay={300} label={commandButtonTooltipLabel}>
						<ActionIcon onClick={() => openSpotlight()}>
							<ThemeIcon variant="filled">
								<Command width={20} height={20} />
							</ThemeIcon>
						</ActionIcon>
					</Tooltip>
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
		</Navbar>
	);

	return (
		<AppShell
			padding={router.pathname === "/" ? 0 : "lg"}
			navbar={showUserLinks ? undefined : navbarContent}
			navbarOffsetBreakpoint="xs"
			header={<Header height={60}>{topBarContent}</Header>}
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

			<FocusModeContentSpacer />
		</AppShell>
	);
}
