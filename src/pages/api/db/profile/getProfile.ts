// src/pages/api/db/profile/getProfile.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getProfile } from "../../../services/db/profile/getProfile";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const profile = await getProfile(userId);
  if (!profile) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(profile);
}

