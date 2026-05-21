import { NextFunction, Request, Response } from "express";
import { authServices } from "./authServices";
import sendResponse from "../../utility/sendResponse";

const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authServices.signUpUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User signup successfull",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authServices.loginUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const authController = {
  signUpUser,
  loginUser,
};
