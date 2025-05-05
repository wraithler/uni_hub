import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Community } from "@/api/communities/communityTypes.ts";
import api from "@/api/apiClient.ts";
import { communityQueryKeys } from "@/api/communities/communityQueryKeys.ts";
import { toast } from "sonner";

export function useCommunityRequestJoin() {
  const queryClient = useQueryClient();

  const joinCommunityFn = async (community: Community) => {
    const response = await api.post(`/communities/${community.id}/request-join/`);
    return response.data;
  };

  return useMutation({
    mutationFn: joinCommunityFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: communityQueryKeys.all });
    },
    onSuccess: (data: Community) => {
      toast.success(`You requested to join ${data.name}!`);
    },
  });
}
