import {useMutation, useQueryClient} from "@tanstack/react-query";
import {communityQueryKeys} from "@/api/communities/communityQueryKeys.ts";
import {toast} from "sonner";
import {TSFix} from "@/api";
import {useNavigate} from "react-router-dom";
import api from "../apiClient";

export function useCommunityDelete() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteCommunityFn = async (community_id: number) => {
    const response = await api.post(`/communities/${community_id}/delete/`, {
      community_id,
    });
    return response.data;
  };

  return useMutation({
    mutationFn: deleteCommunityFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: communityQueryKeys.all });
    },
    onSuccess: () => {
      navigate("/feed");
      toast.success("Your community was deleted successfully!");
    },
    onError: (_err, _newCommunity, context?: TSFix) => {
      queryClient.setQueryData(
        communityQueryKeys.all,
        context.previousCommunities,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all });
    },
  })
}
