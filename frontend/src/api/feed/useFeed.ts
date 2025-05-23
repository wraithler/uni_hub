import api from "@/api/apiClient.ts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { feedQueryKeys } from "@/api/feed/feedQueryKeys.ts";

export const useFeed = () => {
  const getFeedFn = async ({ pageParam = 1 }) => {
    const offset = (pageParam - 1) * 10;
    const response = await api.get("/posts/", { params: { limit: 10, offset, includeCommunity: true } });
    return response.data;
  };

  return useInfiniteQuery({
    queryKey: feedQueryKeys.infinite,
    queryFn: getFeedFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.results.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};
