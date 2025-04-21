import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient.ts";
import { postQueryKeys } from "@/api/posts/postQueryKeys.ts";
import { Post } from "@/api/posts/postTypes.ts";
import { useNavigate } from "react-router-dom";
import { TSFix } from "@/api";
import { toast } from "sonner";

export function usePostCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    onSuccess: (data: Post) => {
      toast.success("Your post was created successfully!", {
        action: {
          label: "View Post",
          onClick: () => {
            navigate(`/posts/${data.id}`);
          },
        },
      });
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
