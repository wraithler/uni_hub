import { useQuery } from "@tanstack/react-query";
import { communityQueryKeys } from "./communityQueryKeys.ts";
import api from "../apiClient.ts";
import { PaginationProps } from "@/api";

type UseCommunitiesParams = PaginationProps & {
  my?: boolean;
  category_name?: string;
  is_featured?: boolean;
};

export function useCommunities(params: UseCommunitiesParams) {
  const getCommunitiesFn = async () => {
    const response = await api.get("/communities/", {
      params,
    });
    return response.data;
  };

  return useQuery({
    queryKey: communityQueryKeys.all,
    queryFn: getCommunitiesFn,
  });
}
