import { Router } from "express";
import {
    getMetaLeads,
    getGoogleLeads,
    syncMetaLeads,
    syncGoogleLeads,
} from "../controllers/integrationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/meta/leads", getMetaLeads);
router.get("/google/leads", getGoogleLeads);
router.post("/sync/meta", authMiddleware, syncMetaLeads);
router.post("/sync/google", authMiddleware, syncGoogleLeads);
export default router;