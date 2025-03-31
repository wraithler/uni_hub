import { Community } from "@/api/types/communities.tsx";
import api from "@/api/api.ts";
import { useQuery } from "@tanstack/react-query";

interface UseCommunityProps {
  community_id: number;
}

export const useCommunity = ({ community_id }: UseCommunityProps) => {
  return useQuery({
    queryKey: ["community", { community_id }],
    queryFn: async () => {
      const response = await api.get(`/communities/${community_id}/`);
      return response.data as Community;
    },
    placeholderData: (prevData) => prevData,
    staleTime: 5 * 60 * 1000,
  });
};
