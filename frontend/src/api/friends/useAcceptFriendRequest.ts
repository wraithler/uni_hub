import { useMutation } from "@tanstack/react-query";
import api from "@/api/apiClient";

export function useAcceptFriendRequest() {
  return useMutation({
    mutationFn: async (request_id: number) => {
      const response = await api.post("/friends/accept/", { request_id }); // wrap it here
      return response.data;
    },
  });
}
