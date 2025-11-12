import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

export default router;
