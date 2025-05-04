import { PaginationResponse } from "@/api";
import { User } from "@/api/users/userTypes.ts";
import { Post } from "@/api/posts/postTypes.ts";

type Like = {
  id?: number;
  user: User;
  content_type: string;
  object_id: number;
  content_object?: Post | Comment;
};

type Comment = {
  id?: number;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: User;
  post: Post;
  
  // Counts
  like_count?: number;
  
  // Per user
  has_liked?: boolean;

  hours_since_commented?: number;
};

type CommentList = PaginationResponse & {
  results: Comment[];
};

type LikeList = PaginationResponse & {
  results: Like[];
};

export type { Like, Comment, CommentList, LikeList };