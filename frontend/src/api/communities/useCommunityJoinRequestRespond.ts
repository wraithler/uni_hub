import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../apiClient";
import { toast } from "sonner";
import { communityQueryKeys } from "@/api/communities/communityQueryKeys.ts";
import { useParams } from "react-router-dom";

type CommunityJoinRequestRespond = {
  join_request_id: number;
  responseChoice: "accept" | "reject";
};

export default function useCommunityJoinRequestRespond() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const joinRequestRespondFn = async ({
    join_request_id,
    responseChoice,
  }: CommunityJoinRequestRespond) => {
    const response = await api.post(
      `/communities/join-requests/${join_request_id}/respond/`,
      { response: responseChoice },
    );
    return response.data;
  };

  return useMutation({
    mutationFn: joinRequestRespondFn,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: communityQueryKeys.dashboard(Number(id)),
      });
    },
    onSuccess: () => {
      toast.success("Successfully accepted request");
    },
    onError: () => {
      toast.error("Error occurred");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.dashboard(Number(id)),
      });
    },
  });
}
