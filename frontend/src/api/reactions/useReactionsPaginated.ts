import { CommentsQueryParameters } from "./reactionQueryParameters.ts";
import api from "../apiClient.ts";
import { commentQueryKeys } from "./reactionQueryKeys.ts";
import { usePaginatedQuery } from "@/lib/tanstackExtension.ts";

export function useCommentsPaginated(params: CommentsQueryParameters) {
  const getCommentsPaginatedFn = async () => {
    const response = await api.get("/reactions/comments/", { params });
    return response.data;
  };

  return usePaginatedQuery({
    queryKey: commentQueryKeys.pagination(params),
    queryFn: getCommentsPaginatedFn,
    params,
    limit: params.limit || 10,
  });
}