import { PaginationResponse } from "@/api";

type FeedItem = {
  id: number;
  type: "post" | "event";
  title: string;
  created_by: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  community: {
    id: number;
    name: string;
  };
  timestamp: string;

  // Just for events:
  description?: string;
  attendees?: number;
  location?: string;

  // Just for posts:
  content?: string;
  likes?: number;
  comments?: number;
};

type FeedList = PaginationResponse & {
  results: FeedItem[];
};

export type { FeedItem, FeedList };