import api from "@/api/apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { communityQueryKeys } from "@/api/communities/communityQueryKeys.ts";
import { Community } from "./communityTypes";

type UseCommunityDetailProps = {
  id: number;
};

export function useCommunityDetail({ id }: UseCommunityDetailProps) {
  const getCommunityFn = async () => {
    const response = await api.get(`/communities/${id}/`);
    return response.data as Community;
  };

  return useQuery({
    queryKey: communityQueryKeys.detail(id),
    queryFn: getCommunityFn,
  });
}
