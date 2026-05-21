import type { NextFunction, Request, Response } from "express";

const routeNotFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

export default routeNotFoundHandler;
