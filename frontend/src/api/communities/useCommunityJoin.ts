import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Community } from "@/api/communities/communityTypes.ts";
import api from "@/api/apiClient.ts";
import { communityQueryKeys } from "@/api/communities/communityQueryKeys.ts";
import { toast } from "sonner";
import { TSFix } from "@/api";

export function useCommunityJoin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const joinCommunityFn = async (community: Community) => {
    const response = await api.post(`/communities/${community.id}/join/`);
    return response.data;
  };

  return useMutation({
    mutationFn: joinCommunityFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: communityQueryKeys.all });
    },
    onSuccess: (data: Community) => {
      toast.success(`You joined ${data.name}!`, {
        action: {
          label: "View Community",
          onClick: () => {
            navigate(`/communities/${data.id}`);
          },
        },
      });
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
  });
}
