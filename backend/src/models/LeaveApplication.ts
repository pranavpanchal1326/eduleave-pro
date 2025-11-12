import mongoose, { Schema, Document } from "mongoose";

export interface ILeaveApplication extends Document {
  student: mongoose.Types.ObjectId;
  studentName: string;
  studentEmail: string;
  department: string;
  year: number;
  leaveType: "half-day" | "full-day";
  leaveCategory: "sick" | "casual" | "event" | "personal"; // ✅ NEW
  startDate: Date;
  endDate: Date;
  duration: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled"; // ✅ Added 'cancelled'
  attachments?: string[];
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewComments?: string;
  auditTrail: {
    action: string;
    performedBy: string;
    performedAt: Date;
    details: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LeaveApplicationSchema: Schema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ✅ NEW: Index for faster queries
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      index: true, // ✅ NEW: Index for filtering by department
    },
    year: {
      type: Number,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["half-day", "full-day"],
      required: true,
    },
    // ✅ NEW: Leave Category
    leaveCategory: {
      type: String,
      enum: ["sick", "casual", "event", "personal"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true, // ✅ NEW: Index for date-based queries
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: [0.5, "Duration must be at least 0.5 days"], // ✅ NEW: Validation
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      minlength: [10, "Reason must be at least 10 characters"],
      maxlength: [500, "Reason cannot exceed 500 characters"], // ✅ NEW: Max length
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"], // ✅ Added 'cancelled'
      default: "pending",
      index: true, // ✅ NEW: Index for filtering by status
    },
    attachments: [
      {
        type: String,
      },
    ],
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    reviewComments: {
      type: String,
      maxlength: [500, "Review comments cannot exceed 500 characters"], // ✅ NEW
    },
    auditTrail: [
      {
        action: {
          type: String,
          required: true,
        },
        performedBy: {
          type: String,
          required: true,
        },
        performedAt: {
          type: Date,
          default: Date.now,
        },
        details: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ NEW: Compound Indexes for Better Performance
LeaveApplicationSchema.index({ student: 1, status: 1 }); // Student + Status
LeaveApplicationSchema.index({ department: 1, status: 1 }); // Department + Status
LeaveApplicationSchema.index({ startDate: 1, endDate: 1 }); // Date range queries
LeaveApplicationSchema.index({ leaveCategory: 1, status: 1 }); // Category + Status

// ✅ NEW: Pre-save Middleware - Auto Audit Trail
LeaveApplicationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.auditTrail.push({
      action: 'created',
      performedBy: this.studentName,
      performedAt: new Date(),
      details: `Leave application created for ${this.leaveCategory} leave`,
    });
  }
  next();
});

export default mongoose.model<ILeaveApplication>(
  "LeaveApplication",
  LeaveApplicationSchema
);
