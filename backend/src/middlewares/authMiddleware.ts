import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// Extend Request to include user
interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
    return;
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // Find user by ID from token
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    // Attach user to request
    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
};

// Authorize roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user || !roles.includes(authReq.user.role)) {
      res.status(403).json({
        success: false,
        error: `User role is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};
