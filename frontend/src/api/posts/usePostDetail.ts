import { useQuery } from "@tanstack/react-query";
import api from "@/api/apiClient.ts";
import { postQueryKeys } from "@/api/posts/postQueryKeys.ts";

type UsePostDetailParams = {
  id: number;
};

export function usePostDetail({ id }: UsePostDetailParams) {
  const getPostFn = async () => {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  };

  return useQuery({
    queryKey: postQueryKeys.detail(id),
    queryFn: getPostFn,
  });
}
