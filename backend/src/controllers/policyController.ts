import { Request, Response, NextFunction } from "express";
import Policy from "../models/Policy";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get current policy
// @route   GET /api/policy
// @access  Private
export const getCurrentPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;

    let policy = await Policy.findOne({ academicYear }).populate(
      "departmentHeads.facultyId departmentHeads.actingHead"
    );

    if (!policy) {
      policy = await Policy.create({
        academicYear,
        leaveQuota: 12,
        holidays: [],
        departmentHeads: [],
      });
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update leave quota
// @route   PUT /api/policy/leave-quota
// @access  Private (Principal)
export const updateLeaveQuota = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { leaveQuota } = req.body;

    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;

    const policy = await Policy.findOneAndUpdate(
      { academicYear },
      { leaveQuota },
      { new: true, upsert: true }
    );

    // Update all students' leave balances
    await User.updateMany({ role: "student" }, { leaveBalance: leaveQuota });

    res.status(200).json({
      success: true,
      message: "Leave quota updated successfully",
      data: policy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add holiday
// @route   POST /api/policy/holidays
// @access  Private (Principal)
export const addHoliday = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date, name, description } = req.body;

    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;

    const policy = await Policy.findOne({ academicYear });

    if (!policy) {
      res.status(404).json({
        success: false,
        error: "Policy not found",
      });
      return;
    }

    policy.holidays.push({ date: new Date(date), name, description });
    await policy.save();

    res.status(201).json({
      success: true,
      message: "Holiday added successfully",
      data: policy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign department head
// @route   POST /api/policy/department-heads
// @access  Private (Principal)
export const assignDepartmentHead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { department, facultyId, actingHead } = req.body;

    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;

    const policy = await Policy.findOne({ academicYear });

    if (!policy) {
      res.status(404).json({
        success: false,
        error: "Policy not found",
      });
      return;
    }

    const existingIndex = policy.departmentHeads.findIndex(
      (dh) => dh.department === department
    );

    if (existingIndex >= 0) {
      policy.departmentHeads[existingIndex] = { department, facultyId, actingHead };
    } else {
      policy.departmentHeads.push({ department, facultyId, actingHead });
    }

    await policy.save();

    res.status(200).json({
      success: true,
      message: "Department head assigned successfully",
      data: policy,
    });
  } catch (error) {
    next(error);
  }
};
