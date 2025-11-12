import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: any;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  console.error("❌ Error:", err);

  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error.statusCode = 400;
    error.message = message;
  }

  if (err.name === "ValidationError") {
    const message = "Validation error";
    error.statusCode = 400;
    error.message = message;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorHandler;
