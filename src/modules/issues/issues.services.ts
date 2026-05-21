import { Request } from "express";
import { pool } from "../../db";

const getAllIssuesFromDB = async (req: Request) => {
  const issues = await pool.query(`
        SELECT issues.*, users.id AS reporter_id, users.name AS reporter_name, users.role AS reporter_role FROM issues LEFT JOIN users ON users.id = issues.reporter_id
    `);

  const issuesWithReporter = issues.rows.map(
    ({ reporter_id, reporter_name, reporter_role, ...rest }) => {
      return {
        ...rest,
        reporter: {
          id: reporter_id,
          name: reporter_name,
          role: reporter_role,
        },
      };
    },
  );

  return issuesWithReporter;
};

export const issuesServices = { getAllIssuesFromDB };
