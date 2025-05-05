import api from "@/api/apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { communityQueryKeys } from "@/api/communities/communityQueryKeys.ts";
import { CommunityDashboard } from "./communityTypes";

type UseCommunityDashboardProps = {
  id: number;
};

export function useCommunityDashboard({ id }: UseCommunityDashboardProps) {
  const getCommunityDashboardFn = async () => {
    const response = await api.get(`/communities/${id}/dashboard`);
    return response.data as CommunityDashboard;
  };

  return useQuery({
    queryKey: communityQueryKeys.dashboard(id),
    queryFn: getCommunityDashboardFn,
  });
}
