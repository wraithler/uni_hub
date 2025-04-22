export type PaginationProps = {
  limit?: number;
  offset?: number;
};

export type PaginationResponse = {
  limit: number;
  offset: number;
  count: number;
  next: string | null;
  previous: string | null;
};

export type TSFix = any;
export const STALE_TIME = 5 * 60 * 1000;
