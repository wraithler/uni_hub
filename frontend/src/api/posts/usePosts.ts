import { useQuery } from "@tanstack/react-query";
import { postQueryKeys } from "./postQueryKeys.ts";
import api from "../apiClient.ts";
import { PostsQueryParameters } from "./postQueryParameters.ts";

export function usePosts(params: PostsQueryParameters) {
  const getPostsFn = async () => {
    const response = await api.get("/posts/", {
      params,
    });
    return response.data;
  };

  return useQuery({
    queryKey: [postQueryKeys.all, params],
    queryFn: getPostsFn,
    placeholderData: (prev) => prev,
  });
}