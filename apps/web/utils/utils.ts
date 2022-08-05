import { isSameDate } from "@mantine/dates";
import tinygradient from "tinygradient";
import { APIError, TaskWithClass, TDemoTask, UserWithoutPassword } from "types";
import * as jwt from "jsonwebtoken";

export function getUserFromJWT(
	token: string | undefined
): UserWithoutPassword | null {
	try {
		const secret = process.env.JWT_SECRET;

		if (!token || !secret) {
			return null;
		}

		const payload = jwt.verify(token, secret) as jwt.JwtPayload;

		return {
			email: payload.email,
			id: payload.id,
		};
	} catch (error) {
		return null;
	}
}

export const unauthorizedResponse = {
	error: {
		message: "Unauthorized",
	} as APIError,
};

export function getHeatmapColor(index: number) {
	if (index < 0 || index > 1) {
		return "#ffffff";
	}
	const gradient = tinygradient("green", "red");
	const colorhsv = gradient.hsvAt(index);
	return "#" + colorhsv.toHex();
}

export function dateIsToday(date: Date): boolean {
	const today = new Date();
	try {
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	} catch (error) {
		return false;
	}
}

export function getHumanDateString(date: Date): string {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	if (dateIsToday(date)) {
		return "Today";
	}
	if (date.getDate() === today.getDate() - 1) {
		return "Yesterday";
	}

	// Tomorrow
	if (date.getDate() === today.getDate() + 1) {
		return "Tomorrow";
	}

	// If date in next 5 days, show day of week
	if (date.getTime() < today.getTime() + 5 * 24 * 60 * 60 * 1000) {
		return date.toLocaleDateString("en-US", {
			weekday: "long",
		});
	}
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}

// Splits array of objects into array of arrays of objects by date property
export const reduceDates = (arr: TaskWithClass[] | TDemoTask[]) => {
	const dates: any[][] = [];
	// Iterate through array of objects
	for (let i = 0; i < arr.length; i++) {
		// Check if date is in one of the groups
		const index = dates.findIndex((group) => {
			if (group.length === 0) {
				return false;
			}
			return isSameDate(group[0].workDate, arr[i].workDate);
		});

		// If date is not in any group, create new group
		if (index === -1) {
			dates.push([arr[i]]);
		}

		// If date is in group, add object to group
		else {
			dates[index].push(arr[i]);
		}
	}

	return dates;
};
