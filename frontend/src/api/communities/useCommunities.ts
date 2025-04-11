import { useQuery } from "@tanstack/react-query";
import { communityQueryKeys } from "./communityQueryKeys.ts";
import api from "../apiClient.ts";

export type UseCommunitiesParams = {
  my?: boolean;
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
