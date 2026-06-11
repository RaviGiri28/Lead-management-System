import { Router } from "express";
import { createLead, getLeads, getLeadById, updateLeadStatus, updateLeadRemarks, assignLead } from "../controllers/leadController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", createLead);
router.get("/get-leads", authMiddleware, getLeads);
router.get("/:id", authMiddleware, getLeadById);
router.patch("/:id/status", authMiddleware, updateLeadStatus);
router.patch("/:id/remarks", authMiddleware, updateLeadRemarks);
router.patch("/:id/assign", authMiddleware, assignLead);
export default router;