import {
  Anchor,
  AppShell,
  Group,
  Header,
  Kbd,
  Navbar,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { ReactElement } from "react";
import { Calendar, Command, List } from "tabler-icons-react";
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

export default function LayoutShell({ children }: LayoutShellProps) {
  const router: NextRouter = useRouter();
  const showUserLinks =
    router.pathname === "/" ||
    router.pathname === "/login" ||
    router.pathname === "/signup";

  const sidebarLinks: SidebarLink[] = [
    { href: "/tasks/today", label: "Today", icon: <Calendar></Calendar> },
    { href: "/tasks/all", label: "All Tasks", icon: <List></List> },
  ];

  const linkComponents = sidebarLinks.map((link) => (
    <Link href={link.href} key={link.href}>
      <UnstyledButton
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

  const headerContent = (
    <Group
      sx={(theme) => ({
        paddingInline: theme.spacing.md,
        height: "100%",
      })}
      position="apart"
    >
      <Logo></Logo>
      <Group spacing={42}>
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
          <UnstyledButton>
            <ThemeIcon variant="light">
              <Command width={20} height={20} />
            </ThemeIcon>
          </UnstyledButton>
        )}

        <ColorSchemeToggle />
      </Group>
    </Group>
  );

  const navbarContent = (
    <Navbar width={{ base: 300 }} p="xs">
      <Navbar.Section>{linkComponents}</Navbar.Section>
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
      header={<Header height={60}>{headerContent}</Header>}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          minHeight: "calc(100vh - 60px)",
        },
      })}
    >
      {children}
    </AppShell>
  );
}
