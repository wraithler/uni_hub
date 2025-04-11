type UserMe = UserStats & {
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    is_superuser: boolean;
    is_staff: boolean;
    role: string;
    is_email_verified: boolean;
    avatar?: string;
    subject: string;
};

type UserStats = {
    community_count: number;
    friend_count: number;
    post_count: number;
}

type User = {
    email: string;
    first_name: string;
    last_name: string;
}

export type {
    UserMe, User
};