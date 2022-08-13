import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { UserWithoutPassword } from "types";
import { getUserFromJWT } from "../utils";

// The app's context - is generated for each incoming request
export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
	async function getUserFromHeader(): Promise<UserWithoutPassword | null> {
		if (opts?.req.cookies.jwt) {
			try {
				const user = await getUserFromJWT(opts.req.cookies.jwt);
				return user;
			} catch (error) {
				return null;
			}
		}
		return null;
	}

	async function getTheme() {
		if (opts?.req.cookies["mantine-color-scheme"]) {
			return opts.req.cookies["mantine-color-scheme"];
		}
		return null;
	}

	async function getSettings() {
		if (opts?.req.cookies["settings"]) {
			return opts.req.cookies["settings"];
		}
		return null;
	}
	const user = await getUserFromHeader();
	const theme = await getTheme();
	const settings = await getSettings();
	return {
		theme,
		user,
		settings,
	};
}
type Context = trpc.inferAsyncReturnType<typeof createContext>;

// Helper function to create a router with your app's context
export function createRouter() {
	return trpc.router<Context>();
}
