import { Prisma } from "@prisma/client";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import { APICompleteRequest, APITaskOrError, TaskWithClass } from "types";
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
		log.warn("User not logged in to complete task");
		res.status(401).json(unauthorizedResponse);
	}

	const body: APICompleteRequest = req.body;
	if (!body.id || !body.hasOwnProperty("complete")) {
		return res
			.status(400)
			.json({ error: { message: "Missing id or complete" } });
	}

	let updateDoc: Prisma.TaskUpdateInput = {
		complete: body.complete,
	};
	if (!!body.minutes) {
		updateDoc = {
			...updateDoc,
			workTime: body.minutes,
		};
	}

	try {
		const prisma = getPrismaPool();
		const task: TaskWithClass = await prisma.task.update({
			where: { id: body.id },
			data: updateDoc,
			include: {
				class: true,
			},
		});
		log.info("Task updated", { task, user });
		res.json({ task });
	} catch (error: any) {
		log.error("Error completing task", { error });
		return res
			.status(500)
			.json({ error: { message: "Internal server error" } });
	}
	// Begins here
}

export default withAxiom(handler);
