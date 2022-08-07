import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import { APISuccessOrError } from "types";
import { getPrismaPool } from "../../../serverapi/prismapool";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils/server";

async function handler(req: NextApiRequest, res: NextApiResponse<APISuccessOrError>) {
	const jwt = getCookie("jwt", { req, res });
	const user = getUserFromJWT(jwt?.toString());

	if (!user) {
		return res.status(401).json({ ...unauthorizedResponse, success: false });
	}

	const id = req.body.id;
	if (!id) {
		return res.status(400).json({ error: { message: "Missing id" }, success: false });
	}

	try {
		const prisma = getPrismaPool();
		await prisma.class.delete({
			where: {
				id: id,
			},
		});
		log.info("user deleted a class", { id, user });
		return res.json({ success: true });
	} catch (error: any) {
		return res.status(500).json({ error: { message: error.message }, success: false });
	}
}

export default withAxiom(handler);
