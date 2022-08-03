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
		{ href: "/tasks", label: "All Tasks", icon: <List /> },
		{ href: "/calendar", label: "Calendar", icon: <Calendar /> },
	];
	const classesGroup: SidebarLink[] = [
		{ href: "/classes", label: "Classes", icon: <School /> },
		{ href: "/settings", label: "Settings", icon: <Settings /> },
	];
	const otherGroup: SidebarLink[] = [];

	const showUserLinks =
		router.pathname === "/" ||
		router.pathname === "/login" ||
		router.pathname === "/signup";

	function SidebarGroup({ links }: SidebarGroupProps) {
		const elements = links.map((link) => {
			return (
				<Link href={link.href}>
					<NavLink
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
						{/* <UnstyledButton onClick={() => router.replace("/settings")}>
							<ThemeIcon variant="light">
								<Settings width={20} height={20} />
							</ThemeIcon>
						</UnstyledButton> */}
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
		>
			<SidebarGroup links={tasksGroup} />
			<SidebarGroup links={classesGroup} />
			<SidebarGroup links={otherGroup} />
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
				},
			})}
		>
			{settings.useFocusMode && <FocusModeDisplay />}
			{children}
		</AppShell>
	);
}
