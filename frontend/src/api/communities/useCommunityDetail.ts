import api from "@/api/apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { communityQueryKeys } from "@/api/communities/communityQueryKeys.ts";

type UseCommunityDetailProps = {
  id: number;
};

export function useCommunityDetail({ id }: UseCommunityDetailProps) {
  const getCommunityFn = async () => {
    const response = await api.get("/communities/", {
      params: { id },
    });
    return response.data;
  };

  return useQuery({
    queryKey: communityQueryKeys.detail(id),
    queryFn: getCommunityFn,
  });
}
