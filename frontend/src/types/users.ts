import api from "@/api";

type UserMe = {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    is_superuser: boolean;
    is_staff: boolean;
}

const fetchUserMe = async (): Promise<UserMe> => {
    return await api.get('/users/me/');
}

export {
    fetchUserMe
}

export type {
    UserMe
}