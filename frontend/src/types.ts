export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

export interface CommunityCategory {
    id: number;
    name: string;
    description: string;
}

export interface Community {
    id: number;
    name: string;
    description: string;
    category: CommunityCategory;
    created_at: Date;
    updated_at: Date;
    created_by: User;
    icon: string;
}

