import { useMutation } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { friendKeys } from "./friendQueryKeys";

interface SendFriendRequestDTO {
  receiver_id: number;
}

interface SendFriendRequestResponse {
  id: number;
  status: string; // "sent"
}

const sendFriendRequest = async (
  data: SendFriendRequestDTO
): Promise<SendFriendRequestResponse> => {
  const response = await api.post("/requests/send/", data);
  return response.data;
};

export function useSendFriendRequest() {
  return useMutation({
    mutationKey: friendKeys.requests(),
    mutationFn: sendFriendRequest,
  });
}
