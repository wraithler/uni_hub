export type Stats = {
  posts: number;
  communities: number;
  friends: number;
}

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  is_friends?: boolean;
  created_at?: string;
  gender: "Male" | "Female" | "Non-binary" | "Prefer not to say" | "Other";
  interests: string[];
  website_url?: string;
  github_url?: string;
  linkedin_url?: string;
  contact_email?: string;
  contact_phone?: string;
  academic_department?: string;
  year_of_study?: number;
  bio?: string;
  banner?: string;
  avatar?: string;
  posts: number;
  communities: number;
  friends: number;
  is_superuser: boolean;
};

type UserStats = {
  community_count: number;
  friend_count: number;
  post_count: number;
};

type UserMe = User &
  UserStats & {
    is_admin: boolean;
    is_superuser: boolean;
    is_staff: boolean;
    is_email_verified: boolean;
    role: string;
  };

export type { User, UserMe, UserStats };
