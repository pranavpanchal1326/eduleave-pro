import { Request, Response, NextFunction } from "express";
import Notification from "../models/Notification";
import { getIO } from "../config/socket";

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404).json({
        success: false,
        error: "Notification not found",
      });
      return;
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        error: "Not authorized",
      });
      return;
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to create and emit notification
export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  relatedLeave?: string
): Promise<void> => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedLeave,
    });

    // Emit real-time notification via Socket.IO
    const io = getIO();
    io.to(userId).emit("new-notification", notification);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
