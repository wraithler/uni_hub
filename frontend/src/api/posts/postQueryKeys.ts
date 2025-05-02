import { PostsQueryParameters } from "./postQueryParameters.ts";

export const postQueryKeys = {
  all: ["posts"],
  details: () => [...postQueryKeys.all, "detail"],
  detail: (id: number) => [...postQueryKeys.details(), id],
  pagination: ({
    limit,
    offset,
    community_id,
    visibility,
    created_by,
    search,
    sort_by,
  }: PostsQueryParameters) => [
    ...postQueryKeys.all,
    "pagination",
    {
      limit,
      offset,
      community_id,
      visibility,
      created_by,
      search,
      sort_by,
    },
  ],
};
