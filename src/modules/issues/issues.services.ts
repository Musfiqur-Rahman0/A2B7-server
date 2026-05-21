import { Request } from "express";
import { pool } from "../../db";

const getAllIssuesFromDB = async (req: Request) => {
  const issues = await pool.query(`
        SELECT * FROM issues 
        `);

  for (const issue of issues.rows) {
    const user = await pool.query(
      `SELECT id, name, role FROM users WHERE id=$1`,
      [issue.reporter_id],
    );

    delete issue.reporter_id;

    issue.reporter = user.rows[0];
  }

  return issues.rows;
};

export const issuesServices = { getAllIssuesFromDB };
