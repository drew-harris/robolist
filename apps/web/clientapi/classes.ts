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

export async function deleteClass(id: string) {
	try {
		const data = await fetch(`/api/classes/delete`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		});
		const json = await data.json();
		if (json.error) {
			console.error(json.error);
			throw new Error(json.error.message);
		}
		return json.success;
	} catch (error: any) {
		console.error(error.message);
		throw new Error(error.message);
	}
}

export async function editClass(classData: Partial<Class>) {
	try {
		const data = await fetch("/api/classes/edit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(classData),
		});
		const json = await data.json();
		if (json.error) {
			console.error(json.error);
			throw new Error(json.error.message);
		}
		return json.success;
	} catch (error: any) {
		console.error(error.message);
		throw new Error(error.message);
	}
}
