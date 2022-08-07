import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import { APISuccessOrError } from "types";
import { getPrismaPool } from "../../../serverapi/prismapool";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils/server";

async function handler(req: NextApiRequest, res: NextApiResponse<APISuccessOrError>) {
	if (req?.method != "POST") {
		return res.status(405).json({ error: { message: "Method not allowed" }, success: false, });
	}
	const jwt = getCookie("jwt", { req, res });
	const user = getUserFromJWT(jwt?.toString());

	if (!user) {
		return res.status(401).json({ ...unauthorizedResponse, success: false });
	}

	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ error: { message: "Missing id" }, success: false });
	}
	if (typeof id !== "string") {
		return res.status(400).json({ error: { message: "id must be a string" }, success: false });
	}

	try {
		const prisma = getPrismaPool();
		await prisma.task.delete({
			where: {
				id,
			},
		});
		log.info("user deleted a task", { id, user });
		return res.json({ success: true });
	} catch (error: any) {
		log.error("user tried to delete a task", { error: error.message });
		return res
			.status(500)
			.json({ error: { message: "Internal server error" }, success: false });
	}
}

export default withAxiom(handler);
