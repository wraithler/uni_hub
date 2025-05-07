import { PaginationProps } from "@/api";

export type CommentSortOptions = "newest" | "oldest" | "most_liked";

export type CommentsQueryParameters = PaginationProps & {
  post_id?: number;
  created_by?: number;
  search?: string;
  sort_by?: CommentSortOptions;
};

export type LikesQueryParameters = {
  content_type?: string;
  object_id?: number;
  user_id?: number;
};