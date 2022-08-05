import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromJWT } from "./utils/user";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	// See if jwt cookie is set

	const cookie = request.cookies.get("jwt");
	if (!cookie) {
		const url = request.nextUrl.clone();
		url.pathname = "/closed";
		return NextResponse.redirect(url);
	}

	if (request.nextUrl.pathname.startsWith("/focus")) {
		if (getUserFromJWT(cookie)) {
			return;
		} else {
			const url = request.nextUrl.clone();
			url.pathname = "/closed";
			return NextResponse.redirect(url);
		}
	}
}

export const config = {
	matcher: [
		"/login",
		"/signup",
		"/settings",
		"/tasks",
		"/focus",
		"/tasks/:path*",
	],
};
