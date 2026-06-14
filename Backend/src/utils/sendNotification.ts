import "../config/firebaseAdmin";
import { getMessaging } from "firebase-admin/messaging";

export const sendNotification = async (
  token: string,
  title: string,
  body: string
) => {
  try {
    const response = await getMessaging().send({
      token,
      notification: {
        title,
        body,
      },
    });

    console.log("Notification sent:", response);
  } catch (error) {
    console.error("Notification error:", error);
  }
};