import { useQuery } from "@tanstack/react-query";
import api from "@/api/apiClient";

export function useFriendList() {
  return useQuery({
    queryKey: ["friend-list"],
    queryFn: async () => {
      const response = await api.get("/friends/list/");
      return response.data;
    },
  });
}