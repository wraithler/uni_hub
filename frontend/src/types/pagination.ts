type PaginationResponse = {
  limit: number;
  offset: number;
  count: number;
  next: string | null;
  previous: string | null;
};

export type { PaginationResponse };
