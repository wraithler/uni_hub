import { PaginationResponse } from "@/api/old/types/pagination.ts";
import { User } from "@/api/old/types/users.ts";

type Event = {
  id: number;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  location: string;
  created_by: User;
  community: number;
  is_virtual_event: boolean;
  virtual_link: string;
};

type EventList = PaginationResponse & {
  results: Event[];
};

export type { Event, EventList };
