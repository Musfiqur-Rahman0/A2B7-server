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

const getSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await issuesServices.getSingleIssueFromDB(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Single issue fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const result = await issuesServices.updateIssueInDB(
      id as string,
      updatedData,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const issuesController = { getAllIssues, getSingleIssue, updateIssue };
