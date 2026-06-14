import { Router } from "express";
import { registerToken, sendTestNotification } from "../controllers/fcmController";

const router = Router();

router.post("/register-token", registerToken);
router.post("/test-notification", sendTestNotification);
export default router;