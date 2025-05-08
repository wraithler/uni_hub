import { useQuery } from "@tanstack/react-query";
import { communityQueryKeys } from "./communityQueryKeys.ts";
import api from "../apiClient.ts";
import { CommunitiesQueryParameters } from "@/api/communities/communityQueryParameters.ts";

export function useCommunities(params: CommunitiesQueryParameters) {
  const getCommunitiesFn = async () => {
    const response = await api.get("/communities/", {
      params,
    });
    return response.data;
  };

  return useQuery({
    queryKey: [communityQueryKeys.all, params],
    queryFn: getCommunitiesFn,
  });
}
