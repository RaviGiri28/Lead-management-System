import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { DeviceToken } from "../entity/DeviceToken";
import { sendNotification } from "../utils/sendNotification";

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

export const sendTestNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const { token } = req.body;

    await sendNotification(
      token,
      "Urban Cruise LMS",
      "Test notification working successfully 🚀"
    );

    return res.status(200).json({
      success: true,
      message: "Notification sent",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
};