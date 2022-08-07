import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import { APIError } from "types";

interface APIHelloWorldResponse {
	error?: APIError;
	message?: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse<APIHelloWorldResponse>) {
	log.info("Hello World called");
	if (req?.method != "GET") {
		return res.status(405).json({ error: { message: "Method not allowed" } });
	}

	// Begins here
	return res.status(200).json({
		message: "Robolist: Take Control Of Your Assignments",
	});
}

export default withAxiom(handler);
