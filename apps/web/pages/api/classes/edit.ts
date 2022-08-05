import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import { getPrismaPool } from "../../../serverapi/prismapool";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils/utils";
import type { Class } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const jwt = getCookie("jwt", { req, res });
	const user = getUserFromJWT(jwt?.toString());

	if (!user) {
		return res.status(401).json(unauthorizedResponse);
	}

	const _class: Partial<Class> = req.body;

	if (!_class.id) {
		return res.status(400).json({ error: { message: "Missing id" } });
	}

	try {
		const prisma = getPrismaPool();
		await prisma.class.update({
			where: {
				id: _class.id,
			},
			data: {
				name: _class.name,
				color: _class.color,
			},
		});
		log.info("user updated a class", { id: _class.id, user });
		return res.json({ success: true });
	} catch (error: any) {
		return res.status(500).json({ error: { message: error.message } });
	}
}

export default withAxiom(handler);
