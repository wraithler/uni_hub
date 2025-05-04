import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../apiClient.ts";
import { commentQueryKeys, likeQueryKeys } from "@/api/reactions/reactionQueryKeys.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TSFix } from "@/api";
import { Comment, Like } from "@/api/reactions/reactionTypes.ts";

export function useCommentCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createCommentFn = async (newComment: Partial<Comment>) => {
    const response = await api.post("/comments/", newComment);
    return response.data;
  };

  return useMutation({
    mutationFn: createCommentFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: commentQueryKeys.all });
    },
    onSuccess: (data: Comment) => {
      toast.success("Your comment was posted successfully!", {
        action: {
          label: "View Comment",
          onClick: () => {
            navigate(`/posts/${data.post.id}`);
          },
        },
      });
    },
    onError: (_err, _newComment, context: TSFix) => {
      queryClient.setQueryData(
        commentQueryKeys.all,
        context.previousComments,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.all });
    },
  });
}

export function useLikeCreate() {
  const queryClient = useQueryClient();

  const createLikeFn = async (newLike: Partial<Like>) => {
    const response = await api.post("/likes/", newLike);
    return response.data;
  };

  return useMutation({
    mutationFn: createLikeFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: likeQueryKeys.all });
    },
    onSuccess: () => {
      toast.success("You liked!");
    },
    onError: (_err, _newLike, context: TSFix) => {
      queryClient.setQueryData(
        likeQueryKeys.all,
        context.previousLikes,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: likeQueryKeys.all });
    },
  });
}