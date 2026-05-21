import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.error(err.stack); // Log the error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error bro from monster",
    error: err,
  });
};

export default globalErrorHandler;
