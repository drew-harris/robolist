import * as bcrypt from "bcrypt";
import { setCookie } from "cookies-next";
import * as JWT from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import {
	APILoginRequest,
	APIRegisterResponse,
	UserWithoutPassword,
} from "types";
import { getPrismaPool } from "../../serverapi/prismapool";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<APIRegisterResponse>
) {
	if (req?.method != "POST") {
		log.warn("Method not allowed", { method: req.method });
		return res
			.status(405)
			.json({ error: { message: "This method is not available" } });
	}

	if (!req.body.email || !req.body.password) {
		log.warn("Missing field", { email: req.body.email });
		return res.status(400).json({ error: { message: "Missing field" } });
	}

	const body: APILoginRequest = req.body;

	const prisma = getPrismaPool();
	try {
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
			include: {
				canvasAccount: true,
			},
		});

		if (!user) {
			log.info("Incorrect email", { email: body.email });
			return res
				.status(400)
				.json({ error: { message: "Email or password is incorrect" } });
		}

		const match = await bcrypt.compare(body.password, user.password);
		if (!match) {
			log.info("Incorrect password", { email: body.email });
			return res
				.status(400)
				.json({ error: { message: "Email or password is incorrect" } });
		}

		// Sign jwt
		let jwt: string;
		try {
			const { password, ...rest } = user;
			const payload = rest;

			const secret: JWT.Secret | undefined = process.env.JWT_SECRET;
			if (!secret) {
				log.error("JWT_SECRET not set");
				return res.status(500).json({
					error: { message: "Could not load secret to sign credentials" },
				});
			}
			jwt = JWT.sign(payload, secret, {
				expiresIn: "14d",
			});
		} catch (error: any) {
			log.error("Error signing JWT", { error: error.message });
			return res.status(500).json({
				error: {
					message: "Could not sign credentials",
					error: error.message,
				},
			});
		}

		// 2 weeks from now
		const date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

		// Expires in 5 weeks
		setCookie("jwt", jwt, {
			// expires: date,
			req,
			res,
			expires: date,
		});

		log.info("User logged in!", { email: user.email });

		return res.status(200).json({
			jwt: jwt,
		});
	} catch (error: any) {
		log.error("Error logging in", { error: error.message });
		return res
			.status(500)
			.json({ error: { message: "Internal Server Error" } });
	}
}

export default withAxiom(handler);
