import { isSameDate } from "@mantine/dates";
import { IoTodayOutline } from "react-icons/io5";
import tinygradient from "tinygradient";
import { TaskWithClass, TDemoTask } from "types";

export function getHeatmapColor(index: number) {
	if (index < 0 || index > 1) {
		return "#ffffff";
	}
	const gradient = tinygradient("green", "red");
	const colorhsv = gradient.hsvAt(index);
	return "#" + colorhsv.toHex();
}

export function thisMorning() {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	return now;
}

export function dateIsToday(date: Date): boolean {
	const today = new Date();
	try {
		return (
			isSameDate(date, today)
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

export const secondToTimeDisplay = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const secondsLeft = seconds - minutes * 60;
	return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
};


export const getNameOfDay = (day: number) => {
	const dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return dates[day];
}

export const getShortNameOfDay = (day: number) => {
	const dates = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return dates[day];
}

export const getWeekdayNumber = (): number => {
	return new Date().getDay();
}