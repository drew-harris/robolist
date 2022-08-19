import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import { APITaskOrError, TaskWithClass } from "types";
import { getPrismaPool } from "../../../serverapi/prismapool";

import { getUserFromJWT, unauthorizedResponse } from "../../../utils/server";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<APITaskOrError>
) {
	if (req?.method != "POST") {
		return res.status(405).json({ error: { message: "Method not allowed" } });
	}
	const jwt = getCookie("jwt", { req, res });
	const user = getUserFromJWT(jwt?.toString());

	if (!user) {
		return res.status(401).json(unauthorizedResponse);
	}
	const doc: Partial<TaskWithClass> = req.body;
	const id = doc.id as string;
	if (!doc.id) {
		return res.status(400).json({ error: { message: "Missing id" } });
	}

	console.log(doc);

	try {
		const classDoc = doc.classId
			? {
					connect: {
						id: doc.classId,
					},
			  }
			: { disconnect: true };
		const prisma = getPrismaPool();
		const updatedTask = await prisma.task.update({
			where: { id },
			data: {
				id: doc.id,
				title: doc.title,
				complete: doc.complete,
				description: doc.description,
				workDate: doc.workDate || undefined,
				dueDate: doc.dueDate || undefined,
				workTime: doc.workTime,
				class: classDoc,
				noWorkTime: doc.noWorkTime || false,
			},
			include: {
				class: true,
			},
		});
		log.info("user updated a task", { id: doc.id, user });
		return res.json({ task: updatedTask });
	} catch (error: any) {
		log.error("user tried to edit a task", { error: error.message });
		return res
			.status(500)
			.json({ error: { message: "Internal server error" } });
	}
}

export default withAxiom(handler);
