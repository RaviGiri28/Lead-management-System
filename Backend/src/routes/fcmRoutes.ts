import { Router } from "express";
import { registerToken } from "../controllers/fcmController";

const router = Router();

router.post("/register-token", registerToken);

export default router;