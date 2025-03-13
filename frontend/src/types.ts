export interface User {
    id: number;
    name: string;
    profile_picture?: string;
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
    emoji: string;
}

