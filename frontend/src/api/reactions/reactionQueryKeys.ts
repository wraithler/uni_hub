import { CommentsQueryParameters, LikesQueryParameters } from "./reactionQueryParameters.ts";

export const commentQueryKeys = {
  all: ["comments"],
  details: () => [...commentQueryKeys.all, "detail"],
  detail: (id: number) => [...commentQueryKeys.details(), id],
  pagination: ({
    limit,
    offset,
    post_id,
    created_by,
    search,
    sort_by,
  }: CommentsQueryParameters) => [
    ...commentQueryKeys.all,
    "pagination",
    {
      limit,
      offset,
      post_id,
      created_by,
      search,
      sort_by,
    },
  ],
};

export const likeQueryKeys = {
  all: ["likes"],
  details: () => [...likeQueryKeys.all, "detail"],
  detail: (id: number) => [...likeQueryKeys.details(), id],
  forContent: ({ content_type, object_id, user_id }: LikesQueryParameters) => [
    ...likeQueryKeys.all,
    "forContent",
    {
      content_type,
      object_id,
      user_id,
    },
  ],
};