export type SortOption = "newest" | "oldest";
export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";

export interface IssueQueryParams {
  sort: string;
  type: string;
  status: string;
}

export interface createIssuePayloadSchema {
  title: string;
  description?: string;
  type: IssueType;
}
export interface Iuser {
  id: string;
  name: string;
  email: string;
  role: string;
}
