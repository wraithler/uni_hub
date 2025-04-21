import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient.ts";
import { postQueryKeys } from "@/api/posts/postQueryKeys.ts";
import { toast } from "sonner";
import { TSFix } from "@/api";

export function usePostDelete() {
  const queryClient = useQueryClient();

  const deletePostFn = async (postId: number) => {
    const response = await api.post(`/posts/${postId}/delete/`);
    return response.data;
  };

  return useMutation({
    mutationFn: deletePostFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postQueryKeys.all });
      await queryClient.cancelQueries({ queryKey: ["feed"] });
    },
    onSuccess: async () => {
      toast.success("Your post was deleted successfully!");
    },
    onError: (_err, _post, context?: TSFix) => {
      queryClient.setQueryData(postQueryKeys.all, context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
