export interface User {
    id: number;
    first_name: string;
    last_name: string;
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

export interface Message {
    id: string;
    sender: User;
    content: string;
    created_at: Date;
}

export interface WebSocketMessage {
    type: "message" | "typing" | "seen";
    content?: string;
    message_id?: string;
    sender?: string;
}