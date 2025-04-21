import {PaginationResponse} from "@/api";

type CommunityCategory = {
  id: number;
  name: string;
};

type Community = {
  // Basic parameters
  id: number;
  name: string;
  category: CommunityCategory;
  description: string;
  about: string;
  tags: string[];
  contact_email: string;
  // created_by: User // TODO: ADD

  // Images
  avatar_url: string;
  banner_url: string;

  // Counts
  member_count: number;
  post_count: number;

  // Per user
  is_member: boolean;
};

type CommunityList = PaginationResponse & {
  // Extend PaginationResponse to have results of type Community[]
  results: Community[];
};

export type { CommunityCategory, Community, CommunityList };
