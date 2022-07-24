import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { APIDateAggregationResponse } from "types";
import { getDates } from "../../../serverapi/dates";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIDateAggregationResponse>
) {
  if (req?.method != "GET") {
    return res.status(405).json({ error: { message: "Method Not Allowed" } });
  }
  const jwt = getCookie("jwt", { req, res });
  const user = getUserFromJWT(jwt?.toString());
  if (!user) {
    return res.status(401).json(unauthorizedResponse);
  }

  const dates = await getDates(user);
  console.log(dates);
  res.json({ dates });
}
