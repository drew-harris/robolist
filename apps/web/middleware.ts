import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { date } from "zod";

const accessNeededPaths = [
	"/settings",
	"/tasks",
	"/focus",
	"/tasks/:path*",
	"/daily",
	"/classes",
	"/calendar",
];

const accountPaths = ["/login", "/signup"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isBeforeRelease =
		new Date().getTime() < new Date("2022-08-21T14:00:00.000Z").getTime();
	const cookie = request.cookies.get("jwt");

	if (cookie) {
		return;
	}

	if (accountPaths.includes(path)) {
		if (isBeforeRelease) {
			const url = request.nextUrl.clone();
			url.pathname = "/closed";
			return NextResponse.redirect(url);
		}
		return;
	}
	const url = request.nextUrl.clone();
	url.pathname = "/login";
	return NextResponse.redirect(url);
}

export const config = {
	matcher: [
		"/settings",
		"/tasks",
		"/focus",
		"/tasks/:path*",
		"/daily",
		"/classes",
		"/calendar",

		"/login",
		"/signup",
	],
};
