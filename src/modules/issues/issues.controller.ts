import { NextFunction, Request, Response } from "express";
import { issuesServices } from "./issues.services";
import sendResponse from "../../utility/sendResponse";
import { Iuser } from "./issues.types";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as Request & { user: Iuser }).user;
    const payload = req.body;

    // console.log("User from request: ", user); // Log the user object
    const result = await issuesServices.createIssueInDB(user, payload);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

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

    const user = (req as Request & { user: any }).user;
    // console.log("User from request: ", user);

    const result = await issuesServices.updateIssueInDB(
      id as string,
      updatedData,
      user,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error updating issue: ");
    next(error);
  }
};

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await issuesServices.deleteIssueFromDB(id as string);

    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found or already deleted",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const issuesController = {
  getAllIssues,
  getSingleIssue,
  updateIssue,
  createIssue,
  deleteIssue,
};
