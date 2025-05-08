export const friendKeys = {
  all: ["friends"] as const,

  list: (userId?: number) => [...friendKeys.all, "list", userId] as const,
  requests: () => [...friendKeys.all, "requests"] as const,
  detail: (friendId: number) => [...friendKeys.all, "detail", friendId] as const,
};
