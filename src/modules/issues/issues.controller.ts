import { NextFunction, Request, Response } from "express";
import { issuesServices } from "./issues.services";
import sendResponse from "../../utility/sendResponse";

const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await issuesServices.getAllIssuesFromDB(req);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues fatched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const issuesController = { getAllIssues };
