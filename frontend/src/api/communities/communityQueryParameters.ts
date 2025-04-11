import { PaginationProps } from "../index.ts";

export type CommunitiesQueryParameters = PaginationProps & {
  category_name?: string;
  is_featured?: boolean;
};
