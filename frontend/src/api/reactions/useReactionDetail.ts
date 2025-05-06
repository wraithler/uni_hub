import api from "@/api/apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { commentQueryKeys, likeQueryKeys } from "@/api/reactions/reactionQueryKeys.ts";
import { Comment, Like } from "./reactionTypes";

type UseCommentDetailProps = {
  id: number;
};

export function useCommentDetail({ id }: UseCommentDetailProps) {
  const getCommentFn = async () => {
    const response = await api.get(`/reactions/comments/${id}/`);
    return response.data as Comment;
  };

  return useQuery({
    queryKey: commentQueryKeys.detail(id),
    queryFn: getCommentFn,
  });
}

type UseLikeDetailProps = {
  id: number;
};

export function useLikeDetail({ id }: UseLikeDetailProps) {
  const getLikeFn = async () => {
    const response = await api.get(`/reactions/likes/${id}/`);
    return response.data as Like;
  };

  return useQuery({
    queryKey: likeQueryKeys.detail(id),
    queryFn: getLikeFn,
  });
}

type UseHasLikedProps = {
  content_type: string;
  object_id: number;
};

export function useHasLiked({ content_type, object_id }: UseHasLikedProps) {
  const getHasLikedFn = async () => {
    const response = await api.get(`/reactions/likes/check/`, {
      params: {
        content_type,
        object_id,
      },
    });
    return response.data;
  };

  return useQuery({
    queryKey: likeQueryKeys.forContent({ content_type, object_id }),
    queryFn: getHasLikedFn,
  });
}