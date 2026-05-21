import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";
import sendResponse from "../utility/sendResponse";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      // 1. Check token presence
      if (!token) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access!!",
        });
      }

      // 2. Verify token and decode
      const decoded = jwt.verify(
        token,
        config.JWT_SECRET as string,
      ) as JwtPayload;

      // 3. Find user
      const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        decoded.email,
      ]);

      if (userData.rows.length === 0) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "User not found!",
        });
      }

      const user = userData.rows[0];

      // 4. Role check
      if (roles.length && !roles.includes(user.role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden!!, This role has no access!",
        });
      }

      (req as any).user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
