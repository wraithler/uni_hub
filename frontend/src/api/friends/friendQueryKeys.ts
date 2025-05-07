export const friendKeys = {
    all: ["friends"] as const,
  
    list: () => [...friendKeys.all, "list"] as const,
    requests: () => [...friendKeys.all, "requests"] as const,
    detail: (friendId: number) => [...friendKeys.all, "detail", friendId] as const,
  };
  