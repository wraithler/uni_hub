import { CommunitiesQueryParameters } from "./communityQueryParameters.ts";
import api from "../apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { communityQueryKeys } from "./communityQueryKeys.ts";
import { STALE_TIME } from "@/api";

export function useCommunitiesPaginated(params: CommunitiesQueryParameters) {
  const getCommunitiesPaginatedFn = async () => {
    const response = await api.get("/communities/", { params });
    return response.data;
  };

  return useQuery({
    queryKey: communityQueryKeys.pagination(params),
    queryFn: getCommunitiesPaginatedFn,
    placeholderData: (previousData) => previousData,
    staleTime: STALE_TIME,
  });
}
