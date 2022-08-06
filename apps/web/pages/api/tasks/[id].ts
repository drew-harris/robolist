import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import { APISingleTaskResponse, UserWithoutPassword } from "types";
import { getTaskById } from "../../../serverapi/tasks";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils/utils";

async function getSingleTask(
	req: NextApiRequest,
	res: NextApiResponse<APISingleTaskResponse>,
	user: UserWithoutPassword
) {
	try {
		if (!req.query.id) {
			throw new Error("Missing id");
		}
		const { id } = req.query;
		if (typeof id !== "string") {
			throw new Error("id must be a string");
		}
		const task = await getTaskById(id, user.id);
		return res.json({ task });
	} catch (error: any) {
		log.error("user tried to get a task", { error: error.message });
		return res
			.status(500)
			.json({ error: { message: "Internal server error" } });
	}
}

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<APISingleTaskResponse>
) {
	if (req?.method != "GET") {
		return res.status(405).json({ error: { message: "Method not allowed" } });
	}
	const jwt = getCookie("jwt", { req, res });
	const user = getUserFromJWT(jwt?.toString());

	if (!user) {
		return res.status(401).json(unauthorizedResponse);
	}

	// Switch methods
	switch (req.method) {
		case "GET":
			return getSingleTask(req, res, user);
		default:
			return res.status(405).json({ error: { message: "Method not allowed" } });
	}
}

export default withAxiom(handler);
