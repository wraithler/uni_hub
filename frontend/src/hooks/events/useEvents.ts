import api from "@/api/old/api.ts";
import { useQuery } from "@tanstack/react-query";
import { PAGINATION_DEFAULT_LIMIT } from "@/constants.ts";

interface UseEventsProps {
  limit: number;
  offset: number;
  community_id?: number;
}

export const useEvents = ({ limit, offset, community_id }: UseEventsProps) => {
  return useQuery({
    queryKey: ["events", { limit, offset, community_id }],
    queryFn: async () => {
      const response = await api.get("/events/", {
        params: {
          limit: PAGINATION_DEFAULT_LIMIT,
          offset: offset,
          community_id: community_id,
        },
      });
      return response.data;
    },
    placeholderData: (prevData) => prevData,
    staleTime: 5 * 60 * 1000,
  });
};
