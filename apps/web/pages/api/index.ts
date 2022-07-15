import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req?.method != "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Begins here
  return res.status(200).json({
    message: "Robolist: The easiest way to get work done",
  });
}
