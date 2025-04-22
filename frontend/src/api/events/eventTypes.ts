
import { PaginationResponse } from "@/api";
import { User } from "@/api/users/userTypes";

export type Event = {
  id?: number;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  location: string;
  is_virtual_event: boolean;
  virtual_link?: string;
  community: number;
  created_by?: User;
};

export type EventList = PaginationResponse & {
  results: Event[];
};
