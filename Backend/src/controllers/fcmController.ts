import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { DeviceToken } from "../entity/DeviceToken";

export const registerToken = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
  const { token } = req.body;

  const repo = AppDataSource.getRepository(DeviceToken);

  const existing = await repo.findOne({ where: { token } });

  if (existing) {
    return res.json({ message: "Token already exists" });
  }

  const newToken = repo.create({ userId, token });

  await repo.save(newToken);

  return res.json({ message: "Token saved successfully" });
};