import { Prisma } from "@prisma/client";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import {
	APICreateTaskResponse,
	APINewTaskRequest,
	APITasksOrError,
	UserWithoutPassword,
} from "types";
import { getPrismaPool } from "../../../serverapi/prismapool";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils/server";

async function createTask(
	req: NextApiRequest,
	res: NextApiResponse<APICreateTaskResponse>,
	user: UserWithoutPassword
) {
	const data: APINewTaskRequest = req.body;
	if (!data.title || !data.workDate || !data.dueDate) {
		log.warn(
			"user tried to create a task without a title, workDate, or dueDate"
		);
		return res.status(400).json({ error: { message: "Missing field" } });
	}

	try {
		const prisma = getPrismaPool();

		const classDoc = data.classId
			? {
					connect: {
						id: data.classId,
					},
			  }
			: undefined;

		const doc: Prisma.TaskCreateInput = {
			dueDate: data.dueDate,
			title: data.title,
			user: {
				connect: {
					id: user.id,
				},
			},
			workDate: data.workDate,
			class: classDoc,
			complete: false,
			description: data.description,
			workTime: data.workTime || null,
		};

		const task = await prisma.task.create({
			data: doc,
		});

		log.info("user created a task", { task, user });

		return res.json({ task });
	} catch (error: any) {
		log.error("user tried to create a task", { error: error.message });
		return res.status(500).json({
			error: { message: "Internal Server Error", error: error.message },
		});
	}
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const jwt = getCookie("jwt", { req, res });
	const user = getUserFromJWT(jwt?.toString());

	if (!user) {
		log.warn("user tried to access tasks without jwt");
		return res.status(401).json(unauthorizedResponse);
	}

	if (req.method == "POST") {
		return await createTask(req, res, user);
	} else if (req.method == "GET") {
	} else {
		return res.status(405).json({ error: { message: "Method not allowed" } });
	}
}

export default withAxiom(handler);
