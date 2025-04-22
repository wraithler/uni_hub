import { EventsQueryParameters } from "./eventQueryParameters";

export const eventQueryKeys = {
  all: ["events"],
  details: () => [...eventQueryKeys.all, "detail"],
  detail: (id: number) => [...eventQueryKeys.details(), id],
  pagination: ({
    limit,
    offset,
    name,
    description,
  }: EventsQueryParameters) => [
    ...eventQueryKeys.all,
    "pagination",
    {
      limit,
      offset,
      name,
      description,
    },
  ],
};