import { PaginationResponse } from "@/api";
import { User } from "@/api/users/userTypes.ts";
import {Engagement, Growth} from "@/api/commonTypes.ts";
import { Event } from "@/api/events/eventTypes.ts";

type CommunityCategory = {
  id: number;
  name: string;
};

type Community = {
  // Basic parameters
  id?: number;
  name: string;
  category?: string;
  description: string;
  about: string;
  tags?: string[];
  contact_email: string;
  guidelines?: string[];
  created_by?: User;
  privacy?: "public" | "private" | "restricted" | string;

  // Images
  avatar_url?: string;
  banner_url?: string;

  // Counts
  member_count?: number;
  post_count?: number;

  // Per user
  is_member?: boolean;
  is_admin?: boolean;
  is_moderator?: boolean;
  has_requested_to_join?: boolean;
};

type CommunityList = PaginationResponse & {
  // Extend PaginationResponse to have results of type Community[]
  results: Community[];
};

type CommunityJoinRequest = {
  id: number;
  is_accepted: boolean;
  user: User;
}

type CommunityDashboard = {
  total_members: number;
  total_posts: number;
  total_events: number;

  pending_requests: CommunityJoinRequest[];
  upcoming_events: Event[];

  member_growth: Growth[];
  engagement: Engagement[];

  admins: User[];
  moderators: User[];
};

export type { CommunityCategory, Community, CommunityList, CommunityDashboard, CommunityJoinRequest };
