import { Request } from "express";
import { pool } from "../../db";
import {
  IssueQueryParams,
  IssueStatus,
  IssueType,
  SortOption,
} from "./issues.types";

const SORT_MAP: Record<SortOption, string> = {
  newest: "created_at DESC",
  oldest: "created_at ASC",
};

const ALLOWED_TYPES = new Set<IssueType>(["bug", "feature_request"]);
const ALLOWED_STATUSES = new Set<IssueStatus>([
  "open",
  "in_progress",
  "resolved",
]);

const isValidSort = (value: unknown): value is SortOption => {
  return typeof value === "string" && value in SORT_MAP;
};
const isValidType = (value: unknown): value is IssueType => {
  return typeof value === "string" && ALLOWED_TYPES.has(value as IssueType);
};
const isValidStatus = (value: unknown): value is IssueStatus => {
  return (
    typeof value === "string" && ALLOWED_STATUSES.has(value as IssueStatus)
  );
};

const seperateReporterInfo = (issue: any) => {
  if (Array.isArray(issue)) {
    const issuesWithReporter = issue.map((issue: any) => {
      const { reporter_id, reporter_name, reporter_role, ...rest } = issue;
      return {
        ...rest,
        reporter: {
          id: reporter_id,
          name: reporter_name,
          role: reporter_role,
        },
      };
    });
    return issuesWithReporter;
  }

  const { reporter_id, reporter_name, reporter_role, ...rest } = issue;

  return {
    ...rest,
    reporter: {
      id: reporter_id,
      name: reporter_name,
      role: reporter_role,
    },
  };
};

const createIssueInDB = async (user: any, payload: any) => {
  const { title, description, type } = payload;
  const { id: reporter_id } = user;
  const result = await pool.query(
    `
        INSERT INTO issues (title, description, type, reporter_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *
      `,
    [title, description, type, reporter_id],
  );

  return result.rows[0];
};

const getAllIssuesFromDB = async (req: Request) => {
  const query = req.query as Partial<IssueQueryParams>;

  const { sort, type, status } = query;

  const safeOrderBy = isValidSort(sort) ? SORT_MAP[sort] : SORT_MAP["newest"];
  const filteredType = isValidType(type) ? type : null;
  const filteredStatus = isValidStatus(status) ? status : null;

  const issues = await pool.query(
    `
        SELECT issues.*, users.id AS reporter_id, users.name AS reporter_name, users.role AS reporter_role FROM issues LEFT JOIN users ON users.id = issues.reporter_id WHERE ($1::text IS NULL or type = $1) AND ($2::text IS NULL or status = $2) ORDER BY ${safeOrderBy}
    `,
    [filteredType, filteredStatus],
  );

  const issuesWithReporter = seperateReporterInfo(issues.rows);

  return issuesWithReporter;
};

const getSingleIssueFromDB = async (id: string) => {
  console.log("Getting issue with id: ", id);

  const result = await pool.query(
    `
       SELECT issues.*, users.id AS reporter_id, users.name AS reporter_name, users.role AS reporter_role FROM issues LEFT JOIN users ON users.id = issues.reporter_id WHERE issues.id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const issueWithReporter = seperateReporterInfo(result.rows[0]);
  return issueWithReporter;
};

const updateIssueInDB = async (id: string, payload: any) => {
  const { title, description, type } = payload;

  const issue = await pool.query(
    `
        UPDATE issues SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type ), updated_at = NOW() WHERE id = $4 AND status = 'open' RETURNING * 
        `,
    [title, description, type, id],
  );

  // console.log("Updated issue: ", issue.rows[0]);
  if (issue.rows.length === 0) {
    throw new Error(
      JSON.stringify({
        message: "Issue not found or the issue is not open",
        statusCode: 404,
      }),
    );
  }

  return issue.rows[0];
};

export const issuesServices = {
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
  createIssueInDB,
};
