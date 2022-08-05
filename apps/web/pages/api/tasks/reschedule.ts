import { Prisma } from "@prisma/client";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import { APIRescheduleRequest, APIRescheduleResponse } from "types";
import { getPrismaPool } from "../../../serverapi/prismapool";
import { getUserFromJWT } from "../../../utils/user";
import { unauthorizedResponse } from "../../../utils/utils";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<APIRescheduleResponse>
) {
	if (req?.method != "POST") {
		return res.status(405).json({ error: { message: "Method not allowed" } });
	}
	const jwt = getCookie("jwt", { req, res });
	const user = getUserFromJWT(jwt?.toString());

	if (!user) {
		return res.status(401).json(unauthorizedResponse);
	}

	const { id, date: newWorkDate }: APIRescheduleRequest = req.body;
	if (!id || !newWorkDate) {
		return res.status(400).json({ error: { message: "Missing id or date" } });
	}
	if (typeof id !== "string") {
		return res.status(400).json({ error: { message: "id must be a string" } });
	}

	try {
		const prisma = getPrismaPool();
		const updateDoc: Prisma.TaskUpdateInput = {
			workDate: newWorkDate,
		};
		const newTask = await prisma.task.update({
			where: { id },
			data: updateDoc,
			include: {
				class: true,
			},
		});
		log.info("user rescheduled a task", { id, user });
		return res.json({ task: newTask });
	} catch (error: any) {
		log.error("user tried to reschedule a task", { error: error.message });
		return res
			.status(500)
			.json({ error: { message: "Internal server error" } });
	}
}

export default withAxiom(handler);
