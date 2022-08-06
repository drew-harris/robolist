import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { withAxiom } from "next-axiom";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req?.method != "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}
	const jwt = getCookie("jwt", { req, res });
	const user = getUserFromJWT(jwt?.toString());
	if (!user) {
		res.status(401).json(unauthorizedResponse);
	}

	// Begins here
	res.json({ user });
}

export default withAxiom(handler);
