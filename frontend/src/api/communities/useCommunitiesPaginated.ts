import { CommunitiesQueryParameters } from "./communityQueryParameters.ts";
import api from "../apiClient.ts";
import { communityQueryKeys } from "./communityQueryKeys.ts";
import { usePaginatedQuery } from "@/lib/tanstackExtension.ts";

export function useCommunitiesPaginated(params: CommunitiesQueryParameters) {
  const getCommunitiesPaginatedFn = async () => {
    const response = await api.get("/communities/", { params });
    return response.data;
  };

  return usePaginatedQuery({
    queryKey: communityQueryKeys.pagination(params),
    queryFn: getCommunitiesPaginatedFn,
    params,
    limit: params.limit || 10,
  });
}
