import { PaginationResponse } from "@/api";
import { User } from "@/api/users/userTypes.ts";
import { Community } from "@/api/communities/communityTypes.ts";

type Post = {
  // Basic parameters
  id?: number;
  content: string;
  created_at?: string;
  updated_at?: string;
  created_by?: User;
  community?: Community;
  
  // Visibility
  privacy?: 'public' | 'members';
  
  // Counts
  like_count?: number;
  comment_count?: number;
  
  // Per user
  has_liked?: boolean;

  media?: number[];
  image_urls?: string[];
};

type PostList = PaginationResponse & {
  results: Post[];
};

export type { Post, PostList };