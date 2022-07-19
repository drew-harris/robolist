import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromJWT, unauthorizedResponse } from "../../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req?.method != "POST") {
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
