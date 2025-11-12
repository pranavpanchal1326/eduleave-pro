import { Request, Response, NextFunction } from "express";
import LeaveApplication from "../models/LeaveApplication";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Create leave application
// @route   POST /api/leave/apply
// @access  Private (Student)
export const applyLeave = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { leaveType, leaveCategory, startDate, endDate, reason } = req.body; // ✅ ADDED leaveCategory
    const user = req.user;

    // ✅ UPDATED validation to include leaveCategory
    if (!leaveType || !leaveCategory || !startDate || !endDate || !reason) {
      res.status(400).json({
        success: false,
        error: "Please provide all required fields including leave category",
      });
      return;
    }

    // Calculate duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    let duration = 0;

    if (leaveType === "half-day") {
      duration = 0.5;
    } else {
      const timeDiff = end.getTime() - start.getTime();
      duration = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    }

    // ✅ REMOVED: Leave balance check (no limits anymore)
    // if (user.leaveBalance < duration) {
    //   res.status(400).json({
    //     success: false,
    //     error: `Insufficient leave balance. You have ${user.leaveBalance} days remaining.`,
    //   });
    //   return;
    // }

    const leaveApplication = await LeaveApplication.create({
      student: user._id,
      studentName: user.name,
      studentEmail: user.email,
      department: user.department,
      year: user.year,
      leaveType,
      leaveCategory, // ✅ ADDED: Include leave category
      startDate: start,
      endDate: end,
      duration,
      reason,
      auditTrail: [
        {
          action: "SUBMITTED",
          performedBy: user.name,
          performedAt: new Date(),
          details: `${leaveCategory} leave application submitted for ${duration} day(s)`, // ✅ UPDATED
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Leave application submitted successfully",
      data: leaveApplication,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leave applications for student
// @route   GET /api/leave/my-applications
// @access  Private (Student)
export const getMyApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const applications = await LeaveApplication.find({
      student: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leave applications for faculty (by department)
// @route   GET /api/leave/pending
// @access  Private (Faculty)
export const getPendingApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const faculty = req.user;

    const applications = await LeaveApplication.find({
      department: faculty.department,
      status: "pending",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for faculty department
// @route   GET /api/leave/department
// @access  Private (Faculty)
export const getDepartmentApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const faculty = req.user;

    const applications = await LeaveApplication.find({
      department: faculty.department,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve leave application
// @route   PUT /api/leave/:id/approve
// @access  Private (Faculty)
export const approveLeave = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const faculty = req.user;

    const application = await LeaveApplication.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: "Leave application not found",
      });
      return;
    }

    if (application.status !== "pending") {
      res.status(400).json({
        success: false,
        error: "Leave application has already been processed",
      });
      return;
    }

    // ✅ REMOVED: Leave balance deduction (no limits anymore)
    // const student = await User.findById(application.student);
    // if (student) {
    //   student.leaveBalance -= application.duration;
    //   await student.save();
    // }

    application.status = "approved";
    application.reviewedBy = faculty._id;
    application.reviewedAt = new Date();
    application.reviewComments = comments || "";
    application.auditTrail.push({
      action: "APPROVED",
      performedBy: faculty.name,
      performedAt: new Date(),
      details: `Leave approved by ${faculty.name}${
        comments ? `: ${comments}` : ""
      }`,
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: "Leave application approved successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject leave application
// @route   PUT /api/leave/:id/reject
// @access  Private (Faculty)
export const rejectLeave = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const faculty = req.user;

    const application = await LeaveApplication.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: "Leave application not found",
      });
      return;
    }

    if (application.status !== "pending") {
      res.status(400).json({
        success: false,
        error: "Leave application has already been processed",
      });
      return;
    }

    application.status = "rejected";
    application.reviewedBy = faculty._id;
    application.reviewedAt = new Date();
    application.reviewComments = comments || "";
    application.auditTrail.push({
      action: "REJECTED",
      performedBy: faculty.name,
      performedAt: new Date(),
      details: `Leave rejected by ${faculty.name}${
        comments ? `: ${comments}` : ""
      }`,
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: "Leave application rejected",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (for Principal/Analytics)
// @route   GET /api/leave/all
// @access  Private (Principal)
export const getAllApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { department, status, startDate, endDate } = req.query;

    let query: any = {};

    if (department) query.department = department;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const applications = await LeaveApplication.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};
