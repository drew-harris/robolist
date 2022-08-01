import { Class } from "@prisma/client";

export async function getClasses(): Promise<Class[]> {
	try {
		const data = await fetch("/api/classes");
		const json = await data.json();
		if (json.error) {
			console.error(json.error);
			throw new Error(json.error.message);
		}
		return json.classes;
	} catch (error: any) {
		throw new Error(error.message);
	}
}
