import {
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
	MantineThemeOverride,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { withTRPC } from "@trpc/next";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";
import superjson from "superjson";
import type { AppRouter } from "trpc-server/src/index";
import FocusTabTitle from "../components/data-display/focus/FocusTabTitle";
import LayoutShell from "../components/layout/LayoutShell";
import SpotlightMenu from "../components/layout/SpotlightMenu";
import FocusContextProvider from "../contexts/FocusContext";
import SettingsContextProvider from "../contexts/SettingsContext";
import "../global.css";
import { pageview } from "../lib/ga";
import { getBaseUrl } from "../utils/trpc";

export { reportWebVitals } from "next-axiom";

const isProduction = process.env.NODE_ENV === "production";

function MyApp(props: any) {
	// function App(props: AppProps & { colorScheme: ColorScheme }) {
	const { Component, pageProps } = props;

	const preferredColorScheme = useColorScheme("dark");

	// const [colorScheme, setColorScheme] =
	// 	useState<ColorScheme>(preferredColorScheme);

	const router = useRouter();

	const [queryClient] = useState(() => new QueryClient());

	const toggleColorScheme = (value?: ColorScheme) => {
		// const nextColorScheme =
		// 	value || (colorScheme === "dark" ? "light" : "dark");
		// setColorScheme(nextColorScheme);
		// const date = new Date(Date.now() + 7 * 24 * 60 * 6000 * 1000);
		// setCookie("mantine-color-scheme", nextColorScheme, {
		// 	expires: date,
		// });
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
		colorScheme: preferredColorScheme,
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
					content={preferredColorScheme == "dark" ? "#1a1b1e" : "white"}
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
				{/* <TrpcReactQueryDevtools position="top-left" /> */}
				<ColorSchemeProvider
					colorScheme={preferredColorScheme}
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
											<LayoutShell>
												<FocusTabTitle />
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

// AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
// MyApp.getInitialProps = async (appContext: AppContext) => {
// 	// const scheme = getCookie("mantine-color-scheme", ctx);
// 	// console.log("Got initial props", scheme);
// 	const appProps = await App.getInitialProps(appContext);
// 	return {
// 		// colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
// 		testing: 123,
// 		...appProps,
// 	};
// };

// Used by trpc

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */

		return {
			url: `${getBaseUrl()}/api/trpc`,
			transformer: superjson,
			/**
			 * @link https://react-query-v3.tanstack.com/reference/QueryClient
			 */
			queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
