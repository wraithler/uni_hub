import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/api/apiClient.ts";
import { communityQueryKeys } from "@/api/communities/communityQueryKeys.ts";
import { TSFix } from "@/api";
import { Community } from "./communityTypes";

export function useCommunityUpdate() {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const updateCommunityFn = async (updatedCommunity: Community) => {
    const response = await api.post(
      `/communities/${id}/update/`,
      updatedCommunity,
    );
    return response.data;
  };

  return useMutation({
    mutationFn: updateCommunityFn,
    onMutate: async (updatedCommunity) => {
      await queryClient.cancelQueries({
        queryKey: communityQueryKeys.detail(Number(id)),
      });
      const previousCommunity = queryClient.getQueryData(
        communityQueryKeys.detail(Number(id)),
      );
      queryClient.setQueryData(
        communityQueryKeys.detail(Number(id)),
        updatedCommunity,
      );
      return {
        previousCommunity: previousCommunity,
        updatedCommunity: updatedCommunity,
      };
    },
    onError: (_err, _updatedCommunity, context?: TSFix) => {
      queryClient.setQueryData(
        communityQueryKeys.detail(Number(id)),
        context.previousCommunity,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all });
    },
  });
}
