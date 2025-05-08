import { useMutation } from "@tanstack/react-query";
import api from "@/api/apiClient";

export function useSendFriendRequest() {
  return useMutation({
    mutationFn: async (receiver_id: number) => {
      const response = await api.post("/friends/send/", { receiver_id });
      return response.data;
    },
  });
}

