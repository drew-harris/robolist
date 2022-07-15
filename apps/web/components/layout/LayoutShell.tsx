import { AppShell, Box, ColorSchemeProvider, Group, Header, Navbar, Title } from "@mantine/core";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { ColorSchemeToggle } from "../ColorSchemeToggle";

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const router: NextRouter = useRouter()

  const headerContent = (
    <Group sx={theme => ({
      paddingInline: theme.spacing.md,
      height: "100%"
    })} position="apart">
      <Link href="/">
      <Title order={2} sx={(theme) => ({
        fontWeight: 700,
        letterSpacing: -1.5,
        cursor: "pointer",
      })}>robolist</Title>
      </Link>
      <ColorSchemeToggle></ColorSchemeToggle>
    </Group>
  )

  const navbarContent = (
    <Navbar width={{ base: 300 }} p="xs">{/* Navbar content */}</Navbar>
  )

  return (
    <AppShell
      padding="md"
      navbar={router.pathname === "/" ? undefined : navbarContent}
      header={<Header height={60}>{headerContent}</ Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <div>{router.pathname}</div>
      {children}
    </AppShell>
  )

}