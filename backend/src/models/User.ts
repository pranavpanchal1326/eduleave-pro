import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "student" | "faculty" | "principal";
  department?: string;
  year?: number;
  collegeName?: string; // ✅ NEW
  googleId?: string;
  isVerified: boolean;
  // ✅ REMOVED: leaveBalance (no limit anymore!)
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      index: true, // ✅ NEW: Index for faster lookups
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["student", "faculty", "principal"],
      required: [true, "Role is required"],
      index: true, // ✅ NEW: Index for role-based queries
    },
    department: {
      type: String,
      required: function (this: IUser) {
        return this.role === "student" || this.role === "faculty";
      },
      trim: true,
      index: true, // ✅ NEW: Index for department-based queries
    },
    year: {
      type: Number,
      required: function (this: IUser) {
        return this.role === "student";
      },
      min: [1, "Year must be between 1 and 4"],
      max: [4, "Year must be between 1 and 4"],
    },
    // ✅ NEW: College Name
    collegeName: {
      type: String,
      trim: true,
      maxlength: [200, "College name cannot exceed 200 characters"],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null values
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // ✅ REMOVED: leaveBalance (students can now apply without limits!)
  },
  {
    timestamps: true,
  }
);

// ✅ NEW: Compound index for better query performance
UserSchema.index({ role: 1, department: 1 }); // Role + Department
UserSchema.index({ role: 1, isVerified: 1 }); // Role + Verified status

// ✅ Password hashing middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// ✅ Password comparison method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ NEW: Transform output to remove __v and format _id
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Extra safety - never return password
    return ret;
  }
});

export default mongoose.model<IUser>("User", UserSchema);
