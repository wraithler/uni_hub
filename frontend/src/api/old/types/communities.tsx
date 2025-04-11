import { BookOpen, Globe, GraduationCap, Layers, Music } from "lucide-react";
import { PaginationFilters } from "@/api/old/types/filters.ts";
import { PaginationResponse } from "@/api/old/types/pagination.ts";

interface Community {
  id: number;
  name: string;
  category_name: Category;
  avatar: string;
  description: string;
  member_count: number;
  post_count: number;
  is_member: boolean;
  tags: string[];
  contact_email: string;
  about: string;
}

type CommunityList = PaginationResponse & {
  results: Community[];
};

type CommunitySortBy =
  | "-name"
  | "name"
  | "-created_at"
  | "created_at"
  | "-updated_at"
  | "updated_at"
  | "popularity"
  | "-popularity";
type CommunityVisibility = "all" | "public" | "private";
type CommunityMembershipStatus = "member" | "all" | "not_member";

export type CommunityFilters = PaginationFilters & {
  name?: string;
  visibility?: CommunityVisibility;
  sort_by?: CommunitySortBy;
  membership_status?: CommunityMembershipStatus;
  is_featured?: boolean;
};

type Category = "Academic" | "Interest" | "Cultural";

const bannerColours = {
  Academic: "from-blue-500 to-indigo-600",
  Cultural: "from-green-500 to-emerald-600",
  Interest: "from-purple-500 to-violet-600",
};

const avatarColours = {
  Academic: "bg-blue-600",
  Cultural: "bg-green-600",
  Interest: "bg-purple-600",
};

const featuredBannerCategoryIcons = {
  Academic: <BookOpen className="w-16 h-16 text-white opacity-20" />,
  Cultural: <Globe className="w-16 h-16 text-white opacity-20" />,
  Interest: <Music className="w-16 h-16 text-white opacity-20" />,
};

const bannerCategoryIcons = {
  Academic: <BookOpen className="w-16 h-16 text-white" />,
  Cultural: <Globe className="w-16 h-16 text-white" />,
  Interest: <Music className="w-16 h-16 text-white" />,
};

const badgeCategoryIcons = {
  Academic: <GraduationCap className="w-4 h-4" />,
  Cultural: <Music className="w-4 h-4" />,
  Interest: <Globe className="w-4 h-4" />,
  default: <Layers className="w-4 h-4" />,
};

export {
  bannerColours,
  avatarColours,
  bannerCategoryIcons,
  badgeCategoryIcons,
  featuredBannerCategoryIcons,
};

export type { Community, Category, CommunityList };
