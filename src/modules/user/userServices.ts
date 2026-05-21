import { pool } from "../../db";

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
        SELECT id, name, email, role, created_at, updated_at FROM users`);

  return result.rows;
};
export const userServices = {
  getAllUsersFromDB,
};
