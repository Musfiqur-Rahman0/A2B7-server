import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";
import { signUpUserPayloadSchema } from "./user.types";

const signUpUserIntoDB = async (payload: signUpUserPayloadSchema) => {
  const { name, email, password, role } = payload;

  const hasedPassword = await bcrypt.hash(password, 12);

  const safeRole =
    role !== "contributor" && role !== "maintainer" ? "contributor" : role;

  const result = await pool.query(
    `
         INSERT INTO users(name, email, password, role ) VALUES($1, $2, $3, $4) RETURNING *
    `,
    [name, email, hasedPassword, safeRole],
  );

  delete result.rows[0].password;

  return result.rows[0];
};

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const result = await pool.query(
    `
         SELECT * FROM users WHERE email = $1
    `,
    [email],
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  delete user.password;

  return {
    token,
    user,
  };
};

export const authServices = {
  signUpUserIntoDB,
  loginUserIntoDB,
};
