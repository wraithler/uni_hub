import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient.ts";
import { communityQueryKeys } from "@/api/communities/communityQueryKeys.ts";
import { TSFix } from "@/api";
import { Community } from "./communityTypes";

export function useCommunityApprove() {
  const queryClient = useQueryClient();

  const approveCommunityFn = async ({
    id,
    is_accepted,
  }: {
    id: number;
    is_accepted: boolean;
  }) => {
    const response = await api.post(`/communities/${id}/approve/`, {
      is_accepted: is_accepted,
    });
    return response.data;
  };

  return useMutation({
    mutationFn: approveCommunityFn,
    onMutate: async (updatedCommunity) => {
      await queryClient.cancelQueries({
        queryKey: communityQueryKeys.detail(Number(updatedCommunity.id)),
      });

      const previousCommunity = queryClient.getQueryData<Community>(
        communityQueryKeys.detail(Number(updatedCommunity.id)),
      );

      queryClient.setQueryData(
        communityQueryKeys.detail(Number(updatedCommunity.id)),
        {
          ...previousCommunity,
          ...updatedCommunity,
        },
      );

      return { previousCommunity };
    },
    onError: (_err, _updatedCommunity, context?: TSFix) => {
      queryClient.setQueryData(
        communityQueryKeys.detail(Number(_updatedCommunity.id)),
        context.previousCommunity,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === communityQueryKeys.all,
      });
    },
  });
}
