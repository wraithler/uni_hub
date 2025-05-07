export interface Friend {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  }

  export interface FriendRequest {
    id: number;
    sender: number;
    receiver: number;
    is_accepted: boolean;
    is_declined: boolean;
    created_at: string;
  }
  