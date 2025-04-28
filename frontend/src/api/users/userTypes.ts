type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  subject: string;
  avatar?: string;
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
  };

export type { User, UserMe, UserStats };
