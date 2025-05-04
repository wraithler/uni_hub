import { useQuery } from "@tanstack/react-query";
import { commentQueryKeys, likeQueryKeys } from "./reactionQueryKeys.ts";
import api from "../apiClient.ts";
import { CommentsQueryParameters, LikesQueryParameters } from "./reactionQueryParameters.ts";

export function useComments(params: CommentsQueryParameters) {
  const getCommentsFn = async () => {
    const response = await api.get("/comments/", {
      params,
    });
    return response.data;
  };

  return useQuery({
    queryKey: [commentQueryKeys.all, params],
    queryFn: getCommentsFn,
    placeholderData: (prev) => prev,
  });
}

export function useLikes(params: LikesQueryParameters) {
  const getLikesFn = async () => {
    const response = await api.get("/likes/", {
      params,
    });
    return response.data;
  };

  return useQuery({
    queryKey: [likeQueryKeys.all, params],
    queryFn: getLikesFn,
    placeholderData: (prev) => prev,
  });
}