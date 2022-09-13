import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { date } from "zod";

const accessNeededPaths = [
	"/settings",
	"/tasks",
	"/focus",
	"/tasks/:path*",
	"/daily",
	"/canvas/connect",
	"/classes",
	"/calendar",
];

const accountPaths = ["/login", "/signup"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const cookie = request.cookies.get("jwt");

	if (cookie) {
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
	],
};
