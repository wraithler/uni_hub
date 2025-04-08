type UserMe = {
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    is_superuser: boolean;
    is_staff: boolean;
    role: string;
    is_email_verified: boolean;
};

type User = {
    email: string;
    first_name: string;
    last_name: string;
}

export type {
    UserMe, User
};