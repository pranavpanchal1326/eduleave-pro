import express from "express";
import {
  getCurrentPolicy,
  updateLeaveQuota,
  addHoliday,
  assignDepartmentHead,
} from "../controllers/policyController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, getCurrentPolicy);
router.put("/leave-quota", protect, authorize("principal"), updateLeaveQuota);
router.post("/holidays", protect, authorize("principal"), addHoliday);
router.post("/department-heads", protect, authorize("principal"), assignDepartmentHead);

export default router;
