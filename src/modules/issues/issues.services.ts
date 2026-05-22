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
