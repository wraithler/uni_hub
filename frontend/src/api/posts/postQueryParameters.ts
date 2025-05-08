import { PaginationProps } from "@/api";

export type PostSortOptions = "newest" | "oldest" | "most_liked";

export type PostsQueryParameters = PaginationProps & {
  my?: boolean;
  community_id?: number;
  privacy?: "public" | "members";
  created_by?: number;
  search?: string;
  sort_by?: PostSortOptions;
  pinned?: boolean;
  user_id?: number;
};