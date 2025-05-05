import { PaginationProps } from "@/api";

export type ReportSortOptions = 
  | "newest" 
  | "oldest" 
  | "status";

export type ReportQueryParams = PaginationProps & {
  id?: number;
  status?: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  reported_by?: number;
  reported_user?: number;
  community?: number;
  is_my_report?: boolean;
  sort_by?: ReportSortOptions;
};