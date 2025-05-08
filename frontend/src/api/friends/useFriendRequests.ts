import { useQuery } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { FriendRequest } from "./friendTypes";
import { friendKeys } from "./friendQueryKeys";

const getFriendRequests = async (): Promise<FriendRequest[]> => {
  const response = await api.get("/requests/");
  return response.data;
};

export function useFriendRequests() {
  return useQuery({
    queryKey: friendKeys.requests(),
    queryFn: getFriendRequests,
  });
}
