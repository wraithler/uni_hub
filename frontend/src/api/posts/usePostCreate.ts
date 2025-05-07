import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient.ts";
import { postQueryKeys } from "@/api/posts/postQueryKeys.ts";
import { Post } from "@/api/posts/postTypes.ts";
import { TSFix } from "@/api";
import { toast } from "sonner";

export function usePostCreate() {
  const queryClient = useQueryClient();
  
  const createPostFn = async (newPost: Post) => {
    const response = await api.post("/posts/create/", newPost);
    return response.data;
  };

  return useMutation({
    mutationFn: createPostFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postQueryKeys.all });
      await queryClient.cancelQueries({ queryKey: ["feed"] });
    },
    onSuccess: () => {
      toast.success("Your post was created successfully!");
    },
    onError: (_err, _newPost, context?: TSFix) => {
      queryClient.setQueryData(postQueryKeys.all, context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
