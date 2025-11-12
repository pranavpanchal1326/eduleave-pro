import express from "express";
import { getLeaveStats, getMonthlyTrends } from "../controllers/analyticsController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/stats", protect, authorize("principal"), getLeaveStats);
router.get("/trends", protect, authorize("principal"), getMonthlyTrends);

export default router;
