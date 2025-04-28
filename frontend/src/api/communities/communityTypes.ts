import { PaginationResponse } from "@/api";
import { User } from "@/api/users/userTypes.ts";

type CommunityCategory = {
  id: number;
  name: string;
};

type Community = {
  // Basic parameters
  id?: number;
  name: string;
  category: string;
  description: string;
  about: string;
  tags: string[];
  contact_email: string;
  guidelines: string[];
  created_by?: User;
  privacy?: string;

  // Images
  avatar_url?: string;
  banner_url?: string;

  // Counts
  member_count?: number;
  post_count?: number;

  // Per user
  is_member?: boolean;
};

type CommunityList = PaginationResponse & {
  // Extend PaginationResponse to have results of type Community[]
  results: Community[];
};

export type { CommunityCategory, Community, CommunityList };
