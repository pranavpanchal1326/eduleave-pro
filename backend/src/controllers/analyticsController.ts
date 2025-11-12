import { Request, Response, NextFunction } from "express";
import LeaveApplication from "../models/LeaveApplication";
import User from "../models/User";

// @desc    Get leave statistics
// @route   GET /api/analytics/stats
// @access  Private (Principal)
export const getLeaveStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate, department } = req.query;

    let query: any = {};

    if (department) query.department = department;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const totalApplications = await LeaveApplication.countDocuments(query);
    const pending = await LeaveApplication.countDocuments({ ...query, status: "pending" });
    const approved = await LeaveApplication.countDocuments({ ...query, status: "approved" });
    const rejected = await LeaveApplication.countDocuments({ ...query, status: "rejected" });

    const departmentStats = await LeaveApplication.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalApplications,
          pending,
          approved,
          rejected,
        },
        byDepartment: departmentStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly trends
// @route   GET /api/analytics/trends
// @access  Private (Principal)
export const getMonthlyTrends = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trends = await LeaveApplication.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};
