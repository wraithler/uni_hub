import { PaginationProps } from "@/api";

export type EventsQueryParameters = PaginationProps & {
  community_id?: number;
  name?: string;
  description?: string;
  past?: boolean;
  upcoming?: boolean;
};
