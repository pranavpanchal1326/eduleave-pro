import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User, { IUser } from "../models/User";

// Extend Request interface to include user
interface AuthRequest extends Request {
  user?: IUser;
}

// Generate JWT Token  
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  
  return jwt.sign(
    { id }, 
    secret as Secret, 
    { expiresIn: "7d" }
  );
};

// @desc    Register user (Students, Faculty with key, Principal with key)
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      department, 
      year, 
      collegeName,
      registrationKey // ✅ NEW: Registration key for Faculty/Principal
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email",
      });
    }

    // ✅ STUDENT REGISTRATION - No key needed
    if (role === 'student') {
      if (!department || !year) {
        return res.status(400).json({
          success: false,
          error: "Department and year are required for student registration",
        });
      }

      // Create student
      const user = await User.create({
        name,
        email,
        password,
        role: 'student',
        department,
        year,
        collegeName,
        isVerified: true,
      });

      const token = generateToken(user._id.toString());

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          year: user.year,
          collegeName: user.collegeName,
        },
      });
    }

    // ✅ FACULTY REGISTRATION - Needs Faculty Key
    if (role === 'faculty') {
      const facultyKey = process.env.FACULTY_REGISTRATION_KEY;

      if (!facultyKey) {
        return res.status(500).json({
          success: false,
          error: "Faculty registration is not configured",
        });
      }

      if (registrationKey !== facultyKey) {
        return res.status(403).json({
          success: false,
          error: "Invalid faculty registration key",
        });
      }

      if (!department) {
        return res.status(400).json({
          success: false,
          error: "Department is required for faculty registration",
        });
      }

      // Create faculty
      const user = await User.create({
        name,
        email,
        password,
        role: 'faculty',
        department,
        collegeName,
        isVerified: true,
      });

      const token = generateToken(user._id.toString());

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          collegeName: user.collegeName,
        },
      });
    }

    // ✅ PRINCIPAL REGISTRATION - Needs Principal Key
    if (role === 'principal') {
      const principalKey = process.env.PRINCIPAL_REGISTRATION_KEY;

      if (!principalKey) {
        return res.status(500).json({
          success: false,
          error: "Principal registration is not configured",
        });
      }

      if (registrationKey !== principalKey) {
        return res.status(403).json({
          success: false,
          error: "Invalid principal registration key",
        });
      }

      // Create principal
      const user = await User.create({
        name,
        email,
        password,
        role: 'principal',
        collegeName,
        isVerified: true,
      });

      const token = generateToken(user._id.toString());

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          collegeName: user.collegeName,
        },
      });
    }

    // Invalid role
    return res.status(400).json({
      success: false,
      error: "Invalid role. Must be student, faculty, or principal",
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        collegeName: user.collegeName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authorized",
      });
    }

    const user = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
