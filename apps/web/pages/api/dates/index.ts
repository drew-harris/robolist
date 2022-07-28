import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { log, withAxiom } from "next-axiom";
import { APIDateAggregationResponse } from "types";
import { getDates } from "../../../serverapi/dates";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIDateAggregationResponse>
) {
  if (req?.method != "GET") {
    return res.status(405).json({ error: { message: "Method Not Allowed" } });
  }
  const jwt = getCookie("jwt", { req, res });
  const user = getUserFromJWT(jwt?.toString());
  if (!user) {
    log.warn("user tried to access dates without jwt");
    return res.status(401).json(unauthorizedResponse);
  }

  try {
    const dates = await getDates(user);
    log.info("user got dates", { user });
    return res.json({ dates });
  } catch (error: any) {
    log.error("user tried to get dates", { error: error.message });
    return res.status(500).json({ error: { message: error.message } });
  }
}

export default withAxiom(handler);
