import { Request } from "express";
import { pool } from "../../db";
import {
  createIssuePayloadSchema,
  IssueQueryParams,
  IssueStatus,
  IssueType,
  Iuser,
  SortOption,
} from "./issues.types";
import { ForbiddenError, NotFoundError } from "../../utility/errorResponses";

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
      const {
        reporter_id,
        reporter_name,
        reporter_role,
        created_at,
        updated_at,
        ...rest
      } = issue;
      return {
        ...rest,
        reporter: {
          id: reporter_id,
          name: reporter_name,
          role: reporter_role,
        },
        created_at,
        updated_at,
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

const createIssueInDB = async (
  user: Iuser,
  payload: createIssuePayloadSchema,
) => {
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

  if (issuesWithReporter.length === 0) {
    throw new NotFoundError("No issues found");
  }

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
    throw new NotFoundError("Issue not found ");
  }

  const issueWithReporter = seperateReporterInfo(result.rows[0]);
  return issueWithReporter;
};

const updateIssueInDB = async (
  id: string,
  payload: createIssuePayloadSchema,
  user: Iuser,
) => {
  console.log(user);
  const { title, description, type } = payload;

  const isContributor = user.role === "contributor";

  const existingIssue = await pool.query(
    `SELECT * FROM issues WHERE id = $1 AND status = 'open'`,
    [id],
  );

  if (existingIssue.rows.length === 0) {
    throw new NotFoundError("Issue not found or is not open");
  }

  if (isContributor && existingIssue.rows[0].reporter_id !== user.id) {
    throw new ForbiddenError("You can only update your own issues");
  }

  const issue = await pool.query(
    `UPDATE issues 
     SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type), updated_at = NOW() 
     WHERE id = $4 
     RETURNING *`,
    [title, description, type, id],
  );

  return issue.rows[0];
};

const deleteIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING *`,
    [id],
  );
  return result.rows[0];
};

export const issuesServices = {
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
  createIssueInDB,
  deleteIssueFromDB,
};
