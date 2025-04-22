import { PaginationProps } from "@/api";

export type EventsQueryParameters = PaginationProps & {
  name?: string;
  description?: string;
};