import { CommunitiesQueryParameters } from "./communityQueryParameters.ts";

export const communityQueryKeys = {
  all: ["communities"],
  details: () => [...communityQueryKeys.all, "detail"],
  detail: (id: number) => [...communityQueryKeys.details(), id],
  pagination: ({
    limit,
    offset,
    category_name,
    is_featured,
  }: CommunitiesQueryParameters) => [
    ...communityQueryKeys.all,
    "pagination",
    {
      limit,
      offset,
      category_name,
      is_featured,
    },
  ],
};
