import mongoose, { Schema, Document } from "mongoose";

export interface IPolicy extends Document {
  leaveQuota: number;
  holidays: {
    date: Date;
    name: string;
    description?: string;
  }[];
  academicYear: string;
  departmentHeads: {
    department: string;
    facultyId: mongoose.Types.ObjectId;
    actingHead?: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PolicySchema: Schema = new Schema(
  {
    leaveQuota: {
      type: Number,
      required: true,
      default: 12,
    },
    holidays: [
      {
        date: {
          type: Date,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: String,
      },
    ],
    academicYear: {
      type: String,
      required: true,
      unique: true,
    },
    departmentHeads: [
      {
        department: {
          type: String,
          required: true,
        },
        facultyId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        actingHead: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPolicy>("Policy", PolicySchema);
