import { useMutation } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { friendKeys } from "./friendQueryKeys";

interface RespondToRequestDTO {
  request_id: number;
  is_accepted: boolean;
}

interface RespondToRequestResponse {
  status: "accepted" | "declined";
}

const respondToFriendRequest = async (
  data: RespondToRequestDTO
): Promise<RespondToRequestResponse> => {
  const response = await axios.post(`/requests/${data.request_id}/respond/`, {
    is_accepted: data.is_accepted,
  });

  return response.data;
};

export function useRespondToRequest() {
  return useMutation({
    mutationKey: friendKeys.requests(),
    mutationFn: respondToFriendRequest,
  });
}
