import api from "../apiClient.ts";
import { usePaginatedQuery } from "@/lib/tanstackExtension.ts";
import {userQueryKeys} from "@/api/users/userQueryKeys.ts";
import { UserQueryParams } from "@/api/users/userQueryParameters.ts";

export function useUsersPaginated(params: UserQueryParams) {
  const getCommunitiesPaginatedFn = async (
    paginatedParams: UserQueryParams,
  ) => {
    const response = await api.get("/users/", {
      params: paginatedParams,
    });
    return response.data;
  };

  return usePaginatedQuery({
    queryKey: userQueryKeys.pagination(params),
    queryFn: getCommunitiesPaginatedFn,
    params,
    limit: params.limit || 10,
  });
}
