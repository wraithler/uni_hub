import { PaginationResponse } from "@/api";
import { User } from "@/api/users/userTypes.ts";
import {Growth} from "@/api/commonTypes.ts";

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

type CommunityDashboard = {
  total_members: number;
  pending_requests: number;
  total_posts: number;
  total_events: number;

  member_growth: Growth[];
  engagement: any;
}

export type { CommunityCategory, Community, CommunityList, CommunityDashboard };
