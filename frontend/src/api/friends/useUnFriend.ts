import { useMutation } from "@tanstack/react-query";
import api from "@/api/apiClient";

export function useUnfriend() {
  return useMutation({
    mutationFn: async (friend_id: number) => {
      const response = await api.post("/friends/unfriend/", { friend_id });
      return response.data;
    },
  });
}
