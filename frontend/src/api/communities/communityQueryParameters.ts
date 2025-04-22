import { PaginationProps } from "@/api";

export type CommunitiesQueryParameters = PaginationProps & {
  category_name?: string;
  is_featured?: boolean;
};
