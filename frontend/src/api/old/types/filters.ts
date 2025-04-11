export default interface Filters {
  [key: string]: any;
}

export type PaginationFilters = {
  limit?: number;
  offset?: number;
};

