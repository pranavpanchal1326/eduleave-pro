import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: "leave_submitted" | "leave_approved" | "leave_rejected" | "reminder";
  title: string;
  message: string;
  relatedLeave?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["leave_submitted", "leave_approved", "leave_rejected", "reminder"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedLeave: {
      type: Schema.Types.ObjectId,
      ref: "LeaveApplication",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>("Notification", NotificationSchema);
