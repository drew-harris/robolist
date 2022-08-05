import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import { UserWithoutPassword } from "types";
import { getTodayTasksFromId } from "../../../serverapi/tasks";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils/utils";

async function getTodayTasks(
	req: NextApiRequest,
	res: NextApiResponse,
	user: UserWithoutPassword
) {
	try {
		const tasks = await getTodayTasksFromId(user.id);
		log.info("user got today's tasks", { user });
		return res.json({
			tasks,
		});
	} catch (error: any) {
		log.error("user tried to get today's tasks", { error: error.message });
		return res.status(405).json({
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

	if (req.method == "GET") {
		return await getTodayTasks(req, res, user);
	} else {
		log.warn("user tried to access tasks with wrong method", {
			method: req.method,
		});
		return res.status(405).json({ error: { message: "Method not allowed" } });
	}
}

export default withAxiom(handler);
