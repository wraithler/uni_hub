export const userQueryKeys = {
  all: ["users"],
  me: ["me"],
  details: () => [...userQueryKeys.all, "detail"],
  detail: (id: number) => [...userQueryKeys.details(), id],
  pagination: (limit: number, offset: number) => [
    ...userQueryKeys.all,
    "pagination",
    { limit, offset },
  ],
  stats: ["stats"],
};
