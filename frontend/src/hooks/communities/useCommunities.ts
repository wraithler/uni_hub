import { useQuery } from "@tanstack/react-query";
import api from "@/api/api.ts";
import { CommunityList } from "@/api/types/communities.tsx";
import { PAGINATION_DEFAULT_LIMIT } from "@/constants.ts";

interface UseCommunitiesProps {
  limit: number;
  offset: number;
  category_name?: string;
  is_featured?: boolean;
}

export const useCommunities = ({
  limit,
  offset,
  category_name,
  is_featured,
}: UseCommunitiesProps) => {
  return useQuery({
    queryKey: ["communities", { limit, offset, category_name, is_featured }],
    queryFn: async () => {
      const response = await api.get("/communities/", {
        params: {
          limit: PAGINATION_DEFAULT_LIMIT,
          offset: offset,
          category_name: category_name,
          is_featured: is_featured,
        },
      });
      return response.data as CommunityList;
    },
    placeholderData: (prevData) => prevData,
    staleTime: 5 * 60 * 1000,
  });
};
