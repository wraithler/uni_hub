import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../apiClient.ts";
import { postQueryKeys } from "./postQueryKeys.ts";
import { TSFix } from "@/api";
import { Post } from "./postTypes";

export function usePostUpdate() {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const updatePostMutation = async (updatedPost: Post) => {
    const response = await api.put(
      `/posts/${id}/update/`,
      updatedPost,
    );
    return response.data;
  };

  return useMutation({
    mutationFn: updatePostMutation,
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({
        queryKey: postQueryKeys.detail(Number(id)),
      });
      
      const previousPost = queryClient.getQueryData(
        postQueryKeys.detail(Number(id)),
      );
      
      queryClient.setQueryData(
        postQueryKeys.detail(Number(id)),
        updatedPost,
      );
      
      return {
        previousPost: previousPost,
        updatedPost: updatedPost,
      };
    },
    onError: (_err, _updatedPost, context?: TSFix) => {
      queryClient.setQueryData(
        postQueryKeys.detail(Number(id)),
        context.previousPost,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
    },
  });
}