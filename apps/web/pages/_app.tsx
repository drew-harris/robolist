import {
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
	MantineThemeOverride,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getCookie, setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";
import { RouterTransition } from "../components/affixes/RouterNavigation";
import LayoutShell from "../components/layout/LayoutShell";
import SpotlightMenu from "../components/layout/SpotlightMenu";
import FocusContextProvider from "../contexts/FocusContext";
import SettingsContextProvider from "../contexts/SettingsContext";
import "../global.css";
import { pageview } from "../lib/ga";

export { reportWebVitals } from "next-axiom";

const isProduction = process.env.NODE_ENV === "production";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
	const { Component, pageProps } = props;
	const [colorScheme, setColorScheme] = useState<ColorScheme>(
		props.colorScheme
	);

	const router = useRouter();

	const [queryClient] = useState(() => new QueryClient());

	const toggleColorScheme = (value?: ColorScheme) => {
		const nextColorScheme =
			value || (colorScheme === "dark" ? "light" : "dark");
		setColorScheme(nextColorScheme);
		setCookie("mantine-color-scheme", nextColorScheme, {
			maxAge: 60 * 60 * 24 * 30,
		});
	};

	const [themeDefaultColor, setThemeDefaultColor] = useState("blue");

	// Google analytics
	useEffect(() => {
		const handleRouteChange = (url: URL) => {
			/* invoke analytics function only for production */
			if (isProduction) pageview(url);
		};
		router.events.on("routeChangeComplete", handleRouteChange);
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);

	const theme: MantineThemeOverride = {
		colorScheme,
		fontFamily: "Inter, sans-serif",
		headings: {
			fontFamily: "Inter, sans-serif",
		},
		primaryColor: themeDefaultColor,
	};

	return (
		<>
			<Head>
				<title>Robolist</title>
				<link rel="manifest" href="/manifest.json" />
				<meta
					name="theme-color"
					content={theme.colors?.blue?.[5] || "#1a1b1e"}
				/>
				<link rel="apple-touch-icon" href="/logo-96x96.png" />
				<meta name="apple-mobile-web-app-capable" content="yes"></meta>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
				<link rel="shortcut icon" href="/favicon.svg" />
			</Head>

			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_MEASUREMENT_ID}');
        `}
			</Script>

			<QueryClientProvider client={queryClient}>
				{process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
				<ColorSchemeProvider
					colorScheme={colorScheme}
					toggleColorScheme={toggleColorScheme}
				>
					<MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
						<SettingsContextProvider
							onColorChange={(color) => {
								setThemeDefaultColor(color);
							}}
						>
							<FocusContextProvider>
								<ModalsProvider>
									<NotificationsProvider>
										<SpotlightMenu>
											<NavigationProgress size={2} stepInterval={10} />
											<RouterTransition />
											<LayoutShell>
												<Component {...pageProps} />
											</LayoutShell>
										</SpotlightMenu>
									</NotificationsProvider>
								</ModalsProvider>
							</FocusContextProvider>
						</SettingsContextProvider>
					</MantineProvider>
				</ColorSchemeProvider>
			</QueryClientProvider>
		</>
	);
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
	colorScheme: getCookie("mantine-color-scheme", ctx) || "dark",
});
