import { UserQueryParams } from "@/api/users/userQueryParameters.ts";

export const userQueryKeys = {
  all: ["users"],
  me: ["me"],
  details: () => [...userQueryKeys.all, "detail"],
  detail: (id?: number) => [...userQueryKeys.details(), id],
  pagination: ({ limit, offset, community_id }: UserQueryParams) => [
    ...userQueryKeys.all,
    "pagination",
    { limit, offset, community_id },
  ],
  stats: ["stats"],
};
