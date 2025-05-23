import { PaginationProps } from "@/api";

export type CommunitySortOptions = "popular" | "new" | "alphabetical";

export type CommunitiesQueryParameters = PaginationProps & {
  my?: boolean;
  category_name?: string;
  is_featured?: boolean;
  name?: string;
  sort_by?: CommunitySortOptions;
  created_by?: number;
  user_id?: number;
  is_accepted?: boolean;
  is_declined?: boolean;
};
