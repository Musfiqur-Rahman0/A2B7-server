import { NextFunction, Request, Response } from "express";
import { userServices } from "./userServices";
import sendResponse from "../../utility/sendResponse";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("form controller: ", (req as any).user);
    const result = await userServices.getAllUsersFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getAllUsers,
};
