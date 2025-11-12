import express from "express";
import {
  applyLeave,
  getMyApplications,
  getPendingApplications,
  getDepartmentApplications,
  approveLeave,
  rejectLeave,
  getAllApplications,
} from "../controllers/leaveController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

// Student routes
router.post("/apply", protect, authorize("student"), applyLeave);
router.get("/my-applications", protect, authorize("student"), getMyApplications);

// Faculty routes
router.get("/pending", protect, authorize("faculty"), getPendingApplications);
router.get("/department", protect, authorize("faculty"), getDepartmentApplications);
router.put("/:id/approve", protect, authorize("faculty"), approveLeave);
router.put("/:id/reject", protect, authorize("faculty"), rejectLeave);

// Principal routes
router.get("/all", protect, authorize("principal"), getAllApplications);

export default router;
