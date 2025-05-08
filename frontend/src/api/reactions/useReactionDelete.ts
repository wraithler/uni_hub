import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient.ts";
import { commentQueryKeys, likeQueryKeys } from "@/api/reactions/reactionQueryKeys.ts";
import { toast } from "sonner";
import { TSFix } from "@/api";

export function useCommentDelete() {
  const queryClient = useQueryClient();

  const deleteCommentFn = async (commentId: number) => {
    const response = await api.delete(`/reactions/comments/${commentId}/delete/`);
    return response.data;
  };

  return useMutation({
    mutationFn: deleteCommentFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: commentQueryKeys.all });
    },
    onSuccess: async () => {
      toast.success("Comment deleted successfully!");
    },
    onError: (_err, _commentId, context: TSFix) => {
      queryClient.setQueryData(commentQueryKeys.all, context.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.all });
    },
  });
}

export function useLikeDelete() {
  const queryClient = useQueryClient();

  const deleteLikeFn = async (likeId: number) => {
    const response = await api.delete(`/reactions/likes/${likeId}/delete/`);
    return response.data;
  };

  return useMutation({
    mutationFn: deleteLikeFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: likeQueryKeys.all });
    },
    onSuccess: async () => {
      toast.success("Like removed successfully!");
    },
    onError: (_err, _likeId, context: TSFix) => {
      queryClient.setQueryData(likeQueryKeys.all, context.previousLikes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: likeQueryKeys.all });
    },
  });
}

export function useUnlikeContent() {
  const queryClient = useQueryClient();

  const unlikeContentFn = async ({ contentType, objectId }: { contentType: string; objectId: number }) => {
    const response = await api.post(`/reactions/unlike/`, {
      content_type: contentType,
      object_id: objectId,
    });
    return response.data;
  };

  return useMutation({
    mutationFn: unlikeContentFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: likeQueryKeys.all });
    },
    onError: (_err, _data, context: TSFix) => {
      queryClient.setQueryData(likeQueryKeys.all, context.previousLikes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: likeQueryKeys.all });
    },
  });
}