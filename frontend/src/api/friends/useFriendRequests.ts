import { useQuery } from "@tanstack/react-query";
import api from "@/api/apiClient";

export function useFriendRequests() {
  return useQuery({
    queryKey: ["friend-requests"],
    queryFn: async () => {
      const response = await api.get("/friends/received/");
      return response.data;
    },
  });
}
