import { PostsQueryParameters } from "./postQueryParameters.ts";
import api from "../apiClient.ts";
import { postQueryKeys } from "./postQueryKeys.ts";
import { usePaginatedQuery } from "@/lib/tanstackExtension.ts";

export function usePostsPaginated(params: PostsQueryParameters) {
  const getPostsPaginatedFn = async () => {
    const response = await api.get("/posts/", { params });
    return response.data;
  };

  return usePaginatedQuery({
    queryKey: postQueryKeys.pagination(params),
    queryFn: getPostsPaginatedFn,
    params,
    limit: params.limit || 10,
  });
}
