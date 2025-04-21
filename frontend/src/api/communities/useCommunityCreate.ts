import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient.ts";
import { communityQueryKeys } from "@/api/communities/communityQueryKeys.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TSFix } from "@/api";
import {Community} from "@/api/communities/communityTypes.ts";

export function useCommunityCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createCommunityFn = async (newCommunity: Community) => {
    const response = await api.post("/communities/create/", newCommunity);
    return response.data;
  };

  return useMutation({
    mutationFn: createCommunityFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: communityQueryKeys.all });
    },
    onSuccess: (data: Community) => {
      toast.success("Your community was created successfully!", {
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
